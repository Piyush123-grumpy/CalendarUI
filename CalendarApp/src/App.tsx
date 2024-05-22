import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Button, Label, Modal, TextInput } from "flowbite-react";
import Popup from 'reactjs-popup';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import EventCard from './component/event.card'
import { Chips } from "primereact/chips";
type Holiday = {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

type Day = {
  isEmpty: boolean;
  data: Date | string;
  label: string;
}

type Praticipant = {
  name: string
}

type Events = {
  id: number,
  title: string
  description: string
  start_time: string
  end_time: string
  event_date: string
  participants: Praticipant[]
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function App() {

  const [sDate, setsDate] = useState(new Date());

  const [days, setDays] = useState<Day[]>([])

  const [events, setEvents] = useState<Events[]>([
    {
      id: -1,
      title: 'Test',
      description: "lorem ipsum idor loren von mattern horn",
      start_time: "00:00",
      event_date: '0000-00-00',
      end_time: "00:00",
      participants: []
    }
  ])

  const [editId, setEditId] = useState<number>(0)

  const ref = useRef<any>();

  const closeTooltip = () => {
    if (ref.current !== undefined) {

      ref.current.close()
    }
  }

  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('00:00')
  const [endTime, setEndTime] = useState('00:00')
  const [participants, setParticipants] = useState<any>([]);
  const [submitDate, setSubmitDate] = useState<Date>()

  const [editMode, setEditmode] = useState<boolean>(false)

  const createTimeObject = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const milliseconds = new Date().setHours(Number(hours), Number(minutes));
    return new Date(milliseconds);
  }

  const validateTimeFormat = (timeString: string) => {
    const timeFormat = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeFormat.test(timeString);
  };

  const validateInputs = (title: string, description: string, startTime: string, endTime: string, submitDate: Date, participants: Praticipant[]) => {
    if (!title) {
      alert("Title is required.");
      return false;
    }
    if (!description) {
      alert("Description is required.");
      return false;
    }
    if (!validateTimeFormat(startTime)) {
      alert("Start time is invalid. Please use HH:MM format.");
      return false;
    }
    if (!validateTimeFormat(endTime)) {
      alert("End time is invalid. Please use HH:MM format.");
      return false;
    }
    if (!submitDate) {
      alert("Event date is required.");
      return false;
    }
    if (participants.length === 0) {
      alert("At least one participant is required.");
      return false;
    }
    return true;
  };


  const dateConverter = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  const submitData = async () => {

    if (submitDate !== undefined) {
      if (!validateInputs(title, description, startTime, endTime, submitDate, participants)) {
        return;
      }
    }


    const startDateTime = createTimeObject(startTime);
    const endDateTime = createTimeObject(endTime);

    if (startDateTime >= endDateTime) {
      alert("Start time must be before end time.");
      return;
    }
    if (editMode) {
      const data = {
        "title": title,
        "description": description,
        "start_time": startDateTime,
        "end_time": endDateTime,
        'event_date': String(submitDate).slice(0, 10),
        "participants": [] as { name: string }[]
      }
      participants.forEach((element: any) => {
        data['participants'].push({ 'name': element })
      });

      try {
        const response = await axios.put(`http://localhost:8000/calendarData/updateEvent/${editId}`, data);

        alert(response.data.message);
        console.log(response.data.event);

        setEvents(response.data.event)

      } catch (error) {
        console.error('There was an error creating the event!', error);
      }
      setTitle('')
      setDescription('')
      setStartTime('00:00')
      setEndTime('00:00')
      setParticipants([])


    } else {

      if (submitDate !== undefined) {
        const data = {
          "title": title,
          "description": description,
          "start_time": startDateTime,
          "end_time": endDateTime,
          'event_date': dateConverter(submitDate),
          "participants": [] as { name: string }[]
        }

        participants.forEach((element: any) => {
          data['participants'].push({ 'name': element })
        });
        try {
          const response = await axios.post('http://localhost:8000/calendarData/createEvent', data);

          alert(response.data.message);
          console.log(response.data.event);

          setEvents(response.data.event)

        } catch (error) {
          console.error('There was an error creating the event!', error);
        }



        setTitle('')
        setDescription('')
        setStartTime('00:00')
        setEndTime('00:00')
        setParticipants([])

      }

    }


  }

  const handleDelete = async (id:number,date:string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/calendarData/deleteEvent/${id}/${date}`);
      alert(response.data.message);
      console.log(response.data.event);

      setEvents(response.data.event)
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };



  function onCloseModal() {
    setOpenModal(false);
    setTitle('');
    setEditmode(false)
  }

  const findMonthDays = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const findFirstDay = (y: number, m: number) => {
    return new Date(y, m, 1).getDay();
  };


  const handleDateClick = async (date: Date) => {

    setsDate(date);
    try {
      const { data } = await axios.get(`http://localhost:8000/calendarData/getDateEvents/${dateConverter(date)}`);
      setEvents(data)

      // alert( response.data.message);
    } catch (error) {
      console.error('There was an error creating the event!', error);
    }

  };

  const showCalendar = async (year: number, month: number, countryCode: string) => {

    const y = year;
    const m = month;
    const mDays = findMonthDays(y, m);
    const fDay = findFirstDay(y, m);

    const allDays: Day[] = [];

    // For empty cells
    for (let p = 0; p < fDay; p++) {
      allDays.push({
        isEmpty: true,
        data: 'em',
        label: ''
      });
    }

    // Show actual days
    for (let d = 1; d <= mDays; d++) {
      const date = new Date(y, m, d);
      allDays.push({
        isEmpty: false,
        data: date,
        label: ''
      });
    }

    await fetchData(year, countryCode, allDays, fDay);
  };


  const changeToPrevMonth = () => {
    setsDate((pDate) => {
      const pMonth = pDate.getMonth() - 1;
      const pYear = pDate.getFullYear();
      return new Date(pYear, pMonth);
    });
    // showCalendar(pYear, pMonth, 'US')

  };

  const changeToNextMonth = () => {
    setsDate((pDate) => {
      const nMonth = pDate.getMonth() + 1;
      const nYear = pDate.getFullYear();
      return new Date(nYear, nMonth);
    });
    // showCalendar(nYear, nMonth, 'US')

  };

  const fetchData = async (year: number, countryCode: string, allDays: Day[], emptyDays: number) => {
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
    try {
      const response = await axios.get(url);
      const holidays: Holiday[] = response.data; // Assuming the API returns an array of Holiday objects

      holidays.forEach((holiday: Holiday) => {
        let newDate = new Date(holiday.date);
        if (newDate.getMonth() === sDate.getMonth()) {
          const holidayDate = new Date(holiday.date);
          allDays[holidayDate.getDate() + emptyDays - 1].label = holiday.name;
        }
      });

      setDays(allDays);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  useEffect(() => {
    showCalendar(sDate.getFullYear(), sDate.getMonth(), 'US'); // Replace 'US' with the appropriate country code
    handleDateClick(sDate)
  }, [sDate]);
  return (

    <div className="flex justify-center items-center ">
      <div>
        <div className="main w-[700px] p-2 ml-4 border border-blue-500">
          <div className=" flex mb-2 justify-between items-center">
            <div onClick={changeToPrevMonth} className="p-5">
              <button className="text-xl cursor-pointer">
                {"<"}
              </button>
            </div>

            <h2 className="font-bold">
              {sDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div onClick={changeToNextMonth} className="p-5">
              <button className="text-xl cursor-pointer">
                {">"}
              </button>
            </div>
          </div>
          <div className="body grid grid-cols-7 gap-1">
            <div className="text-center">Sunday</div>
            <div className="text-center">Monday</div>
            <div className="text-center">Tuesday</div>
            <div className="text-center">Wednesday</div>
            <div className="text-center">Thursday</div>
            <div className="text-center">Friday</div>
            <div className="text-center text-red-500">Saturday</div>

          </div>
          <div className="body grid grid-cols-7 gap-1">
            {/* {showCalendar()} */}
            {days.map((data: any, idx: number) => {
              if (typeof data.data === 'string' && data.data === 'em') {
                return <div key={`em-${idx}`} className="box empty"></div>
              } else {
                // const today = new Date()
                const isSelected = sDate && data.data.toDateString() === sDate.toDateString();

                return (
                  <div key={idx}>
                    <Popup
                      ref={ref}
                      trigger={
                        <div
                          key={`d-${idx}`}
                          className={`relative ${data.data.getDay() == 6 ? 'text-red-600' : ''}  box text-lg ${isSelected ? "selected" : "hover:bg-[#01579b] hover:text-white"} `}
                          onClick={() => {
                            handleDateClick(data.data)

                          }}
                        >
                          <div className="content-center ">
                            <p className={`text-md font-medium text-center`}>{data.data.getDate()}</p>
                            <p className="text-xs font-bold ">{data.label.slice(0, 12)} {data.label.length > 12 ? '...' : null} </p>
                          </div>
                        </div>
                      }
                      closeOnDocumentClick
                      position={'top center'}
                      on={['hover', 'focus']}
                      arrow={data.label !== '' ? true : false}
                    >
                      <div className="flex">
                        <div className="p-5 border-4 text-white bg-[#2382bc]">
                          <p className="font-semibold">
                            {data.data.getMonth() + 1}/{data.data.getDate()}/{data.data.getFullYear()}
                          </p>
                          <p>
                            {data.label !== '' ? data.label : WEEKDAYS[data.data.getDay()]}
                          </p>

                        </div>
                        <div className="p-5 bg-[#fff2df] font-semibold z-50" onClick={() => {
                          closeTooltip()
                          setOpenModal(!openModal)
                          setSubmitDate(data.data)
                        }}>
                          <Button >Add event +</Button>
                        </div>
                      </div>

                    </Popup>
                  </div>
                )
              }
            })}
          </div>
          <div className="z-50">
            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
              <Modal.Header />
              <Modal.Body>
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add event</h3>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email" value="Title" />
                    </div>
                    <TextInput
                      id="title"
                      placeholder="Title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      required
                    />

                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="Description" value="Description" />
                    </div>
                    <TextInput
                      id="Description"
                      placeholder="Description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start time:</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input onChange={(e) => setStartTime(e.target.value)} type="time" id="time" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" value={startTime} required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End time:</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input onChange={(e) => setEndTime(e.target.value)} type="time" id="endTime" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" value={endTime} required />
                      </div>
                    </div>
                  </div>
                  <div className="card p-fluid">
                    <label htmlFor="chips" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Participants:</label>
                    <Chips className="!border !leading-none !border-gray-300 !rounded-lg " value={participants} onChange={(e) => setParticipants(e.target.value)} />

                  </div>
                  <div>
                    <Button onClick={submitData}>Submit</Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
          <div className="m-5 font-semibold">
            Click on a date to view Events
          </div>
          {sDate && (
            <div className="selected-date mt-2 m-5 font-semibold">
              Selected Date: {sDate.toLocaleDateString()}
            </div>
          )}
          <div className="m-5 text-lg font-semibold">
            Events
          </div>
          {events.map((data, idx) => {

            let participantName = data.participants.map((e) => e.name)
            return <div key={idx}>
              <EventCard
                id={data.id}
                setEditmode={setEditmode}
                setEditId={setEditId}
                openModal={openModal}
                setOpenModal={setOpenModal}
                title={data.title}
                description={data.description}
                start_time={data.start_time}
                end_time={data.end_time}
                event_date={data.event_date}
                participants={participantName}
                setTitle={setTitle}
                setDescription={setDescription}
                setStartTime={setStartTime}
                setEndTime={setEndTime}
                setSubmitDate={setSubmitDate}
                setParticipants={setParticipants}
                handleDelete={handleDelete}
              />
            </div>
          })}


        </div>
      </div>
    </div>

  );
}

export default App;
