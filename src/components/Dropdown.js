import Select from 'react-select';

export const Dropdown = ({onChange, placeholder, options}) => {
    return(
        <Select className="pr-1 pl-1" onChange={onChange} placeholder={placeholder} options={options}/>
    )
}

