import React, {useState, useEffect, useRef} from 'react';
import Lottie from 'react-lottie';
import confettiData from '../../assets/lotties/confetti2.json';
import './contact.css';
import {Box, Stack, Button} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import emailjs from '@emailjs/browser';
import BrushStrokeImg from '../../assets/images/abstract/BrushStroke10.png';
import Marquee from 'react-fast-marquee';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

const Confetti = ({show}) => {
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

	const [showConfetti, setShowConfetti] = useState(false);
	const formRef = useRef();
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setShowConfetti(true);
		try {
			const result = await emailjs.sendForm(
				import.meta.env.VITE_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
				formRef.current,
				import.meta.env.VITE_EMAILJS_PUBLIC
			);
			console.log('Form sent successfully:', result.text);
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

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Box className="contactBody 100vh">
			<div className="DVDLogo">
				<img src={BrushStrokeImg} className="brushstrokeImg" />
			</div>
			<Box className="contactOverlay opacity-0">
				<div className="titleMsgText pageTitle-header">
					<h1 className="text-3xl"> Send Me A Message </h1>
				</div>

				<Box className="form-container" sx={{minWidth: '300px'}}>
					<form action="" onSubmit={handleSubmit} ref={formRef}>
						<Stack className="flexCol" spacing={5} sx={{width: '100%', height: '100%'}}>
							<Stack direction="column" className="flexCol inputGroup" gap={2}>
								{/* Name */}
								<Stack direction="column" gap={1} className="inputStack">
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
								<Stack direction="column" gap={1} className="inputStack">
									<label className="form-label" htmlFor="contact-email">
										{' '}
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
								<Stack direction="column" gap={1} className="inputStack">
									<label className="form-label" htmlFor="contact-subject">
										{' '}
										Subject{' '}
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
								<Stack className="inputStack flexCol" gap={1} alignItems={'flex-start'}>
									<label className="form-label" htmlFor="message">
										{' '}
										Message
									</label>
									<textarea
										placeholder="Lets make it happen..."
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
							<button> Send Message </button>
						</div>
					</form>
				</Box>
			</Box>
			<Confetti show={showConfetti} />
		</Box>
	);
};

export default Contact;
