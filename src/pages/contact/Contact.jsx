import React, {useState, useEffect, useRef} from 'react';
import Lottie from 'react-lottie';
import confettiData from '../../assets/lotties/confetti2.json';
import './contact.css';
import {Box, Stack, Button} from '@mui/material';
import emailjs from '@emailjs/browser';
import BrushStrokeImg from '../../assets/images/abstract/BrushStroke10.png';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import useFormData from '../../hooks/useFormData';

export const Confetti = ({show}) => {
	const defaultOptions = {
		loop: false,
		autoplay: true,
		animationData: confettiData,
	};

	return show ? (
		<div className="modal">
			<div className="submittedForm">
				<Lottie options={defaultOptions} width={'100%'} className={'lottie-bg'} />
				<p className="sentMsg">Your message has successfully been sent! We will contact you soon. </p>
			</div>
		</div>
	) : null;
};

const Contact = () => {
	useGSAP(() => {
		const pageIntroTl = gsap.timeline();

		pageIntroTl
			.set('.contactOverlay', {opacity: 1})
			.from('.pageTitle-header', {
				opacity: 0,
				y: 10,
				duration: 0.5,
				delay: 0.3,
			})

			.from(
				'.form-container',
				{
					opacity: 0,
					y: 20,
					duration: 0.7,
					delay: 0.3,
				},
				0.6
			);
	});

	const {formData, setFormData, handleInputChange} = useFormData();
	const [showConfetti, setShowConfetti] = useState(false);
	const formRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setShowConfetti(true);
		try {
			await emailjs.sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, formRef.current, import.meta.env.VITE_EMAILJS_PUBLIC);
			setFormData({
				from_name: '',
				from_email: '',
				subject: '',
				message: '',
				to_name: 'Galaxy Girl Website',
			});
		} catch (error) {
			console.error('Failed to send form:', error);
		} finally {
			setTimeout(() => {
				setShowConfetti(false);
			}, 5000);
		}
	};

	useEffect(() => {
		const handleKeyboardVisibilityChange = (event) => {
			if (event.visible) {
				console.log('Keyboard is visible');
				document.body.style.overflow = 'hidden';
				const activeElement = document.activeElement;
				if (activeElement && inputRefs.current[activeElement.name]) {
					inputRefs.current[activeElement.name].scrollIntoView({behavior: 'smooth', block: 'center'});
				}
			} else {
				console.log('Keyboard is hidden');
				document.body.style.overflow = '';
			}
		};

		if ('virtualKeyboard' in navigator) {
			navigator.virtualKeyboard.addEventListener('keyboardvisibilitychange', handleKeyboardVisibilityChange);

			return () => {
				navigator.virtualKeyboard.removeEventListener('keyboardvisibilitychange', handleKeyboardVisibilityChange);
			};
		}
	}, []);

	return (
		<Box className="contactBody 100vh">
			<div className="DVDLogo">
				<img src={BrushStrokeImg} className="brushstrokeImg" />
			</div>
			<Box className="contactOverlay opacity-0">
				<div className="titleMsgText pageTitle-header">
					<h1 className="text-xl md:text-3xl"> Send Me A Message </h1>
				</div>

				<Box className="form-container" sx={{minWidth: '300px'}}>
					<form ref={formRef} onSubmit={handleSubmit}>
						<Stack spacing={1} sx={{width: '100%', height: '100%'}}>
							<Stack direction="column" gap={2} className="inputGroup">
								{/* Name */}
								<Stack direction="column" className="inputStack">
									<label className="form-label" htmlFor="contact-name">
										Name / Company
									</label>
									<input
										type="text"
										placeholder="Pat McGrath"
										name="from_name"
										id="contact-name"
										required
										className="form-input"
										value={formData.from_name}
										onChange={handleInputChange}
									/>
								</Stack>

								{/* Email */}
								<Stack direction="column" className="inputStack">
									<label className="form-label" htmlFor="contact-email">
										Email
									</label>
									<input
										type="email"
										placeholder="patmcgrath@gmail.com"
										name="from_email"
										id="contact-email"
										value={formData.from_email}
										onChange={handleInputChange}
										required
										className="form-input"
									/>
								</Stack>

								{/* Subject */}
								<Stack direction="column" className="inputStack">
									<label className="form-label" htmlFor="contact-subject">
										Subject
									</label>
									<input
										type="text"
										placeholder="I would love to work with you!"
										id="contact-subject"
										name="subject"
										value={formData.subject}
										onChange={handleInputChange}
										required
										className="form-input"
									/>
								</Stack>
							</Stack>

							{/* Message */}
							<Stack className="flexCol inputGroup2">
								<Stack className="inputStack flexCol" alignItems={'flex-start'}>
									<label className="form-label" htmlFor="message">
										Message
									</label>
									<textarea
										placeholder="Let's make it happen..."
										id="message"
										name="message"
										value={formData.message}
										onChange={handleInputChange}
										required
										className="form-textarea"></textarea>
								</Stack>
							</Stack>
						</Stack>

						<div className="form-row form-btn">
							<Button size="small" type="submit" variant="contained" color="primary">
								Send Message
							</Button>
						</div>
					</form>
				</Box>
			</Box>
			<Confetti show={showConfetti} />
		</Box>
	);
};

export default Contact;

{
	/* <Stack spacing={3}>
	<input type="text" name="from_name" placeholder="Your Name" value={formData.from_name} onChange={handleInputChange} required />
	<input type="email" name="from_email" placeholder="Your Email" value={formData.from_email} onChange={handleInputChange} required />
	<input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleInputChange} required />
	<textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleInputChange} required></textarea>
	<Button type="submit" variant="contained" color="primary">
		Send Message
	</Button>
</Stack>; */
}
