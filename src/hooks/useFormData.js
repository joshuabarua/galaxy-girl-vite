import React, {useState} from 'react';
const useFormData = () => {
	const [formData, setFormData] = useState({
		from_name: '',
		from_email: '',
		subject: '',
		message: '',
		to_name: 'Galaxy Girl Website',
	});

	const handleInputChange = (e) => {
		const {name, value} = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	return {formData, setFormData, handleInputChange};
};

export default useFormData;
