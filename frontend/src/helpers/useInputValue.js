import { useState } from 'react'

export default function useInputValue(field, placeholder, name, style){
    const [value, setValue] = useState('');

    return {
        bind: {
            value,
            type: field,
            style,
            id: `${name || field}Input`,
            className: 'form-control mb-2',
            placeholder: placeholder || field,
            name: name || field,
            onChange: event => setValue(event.target.value),
            required: true
        },
        clear: () => setValue(''),
        value: () => value
    }
}