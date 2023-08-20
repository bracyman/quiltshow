
import { useState } from "react";

const RoomSelector = (props) => {
    const { rooms, currentRoom, selectRoom } = props;

    const updateSelectedRoom = (evt) => {
        selectRoom(evt.target.value);
    };

    return (
        <div>
            <label htmlFor='roomSelector'>Select Room</label>
            <select id="roomSelector" value={currentRoom} onChange={updateSelectedRoom}>
                <option value="" key="blank_room"></option>
                {rooms.map(r => 
                    <option value={r.id} key={`room${r.id}`}>{r.name}</option>
                )}
            </select>
        </div>
    )
};

export default RoomSelector;