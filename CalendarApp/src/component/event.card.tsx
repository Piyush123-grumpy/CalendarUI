

function EventCard(props: any) {
    const {
        id,
        setEditId,
        setEditmode,
        title,
        start_time,
        end_time,
        description,
        participants,
        setTitle,
        event_date,
        setDescription,
        setSubmitDate,
        setStartTime,
        setEndTime,
        setParticipants,
        openModal,
        setOpenModal,
        handleDelete } = props
    function convertToHHMM(datetimeStr: string) {
        // Parse the datetime string into a Date object
        const dateObj = new Date(datetimeStr);

        // Extract hours and minutes
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');

        // Format the time as HH:MM
        const formattedTime = `${hours}:${minutes}`;

        return formattedTime;
    }


    return (
        <div>
            <div className="m-5 p-3 border-4">
                <div className="my-4 font-semibold flex justify-between">
                    <div>
                        Title : {title}
                    </div>
                    <div className="flex">
                        <div className="cursor-pointer" onClick={() => {
                            setEditId(id)
                            setEditmode(true)
                            setOpenModal(!openModal)
                            setTitle(title)
                            setDescription(description)
                            setStartTime(convertToHHMM(start_time))
                            setEndTime(convertToHHMM(end_time))
                            setParticipants(participants)
                            setSubmitDate(event_date)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>

                        </div>
                        <div className="cursor-pointer" onClick={()=>{
                            handleDelete(id,event_date)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div><span className="font-semibold"> Start Time</span>: {convertToHHMM(start_time)}</div>
                    <div><span className="font-semibold"> End Time</span>: {convertToHHMM(end_time)}</div>
                </div>
                <div className="my-[20px]"><span className="font-semibold">Description:</span> {description}</div>
                <div className="my-[20px]"><span className="font-semibold">Participants:</span> {participants.map((data: string) => <p>{data}</p>)}</div>
            </div>
        </div>
    );
}

export default EventCard;