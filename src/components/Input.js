import React from 'react'

export default function Input(props) {

    const removeOnClickHandler = () => {

        props.removeInput(props.index)

    }

    return (
        <div>
            <label className="input">{props.item}</label>
            <button onClick={removeOnClickHandler}>remove</button>
        </div>
    )
}
