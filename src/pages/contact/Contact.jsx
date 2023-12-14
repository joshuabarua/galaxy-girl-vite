import React, {useState, useEffect} from "react";
import Dropdown from "../../components/dropdown/Dropdown";
import Navbar from "../../components/nav/Navbar";
import emailjs from "emailjs-com";
import Lottie from "react-lottie";
import confettiData from "../../assets/lotties/confetti2.json";
import "./contact.css";
import {Box, Stack, Button} from "@mui/material";

const Confetti = ({lottieResult}) => {
	const defaultOptions = {
		loop: false,
		autoplay: true,
		animationData: confettiData,
	};

	return (
		<div className={`lottie-bg ${lottieResult ? "active" : ""}`}>
			<Lottie options={defaultOptions} width={"100%"} />
		</div>
	);
};

const MsgDetail = () => {
	return (
		<>
			<p className="sentMsg">
				Your message has successfully been sent! We will contact you soon.{" "}
			</p>
		</>
	);
};

const Contact = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [result, setResult] = useState(false);
	const [lottieResult, setLottieResult] = useState(false);
	const [secondsLeft, setSecondsLeft] = useState(5);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");

	const toggle = () => {
		setIsOpen((prevIsOpen) => !prevIsOpen);
	};

	const customSubmit = (e) => {
		e.preventDefault();
		e.target.reset();
		sendEmail(e);
		playConfetti(e);
	};

	const sendEmail = (e) => {
		setResult(false);
		e.preventDefault();

		emailjs
			.sendForm(
				"//service_2npcj2s",
				"my-first-templat",
				e.target,
				"user_sA3tlOdalK12Wt9JkvHaZ"
			)
			.then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					console.log(error.text);
				}
			);

		e.target.reset();
		setResult(true);
	};

	const playConfetti = (e) => {
		e.preventDefault();
		setLottieResult(true);
		setSecondsLeft(5);
	};

	useEffect(() => {
		if (lottieResult && secondsLeft > 0) {
			const timerInterval = setInterval(() => {
				setSecondsLeft((prevSeconds) => prevSeconds - 1);
			}, 1000);

			return () => {
				clearInterval(timerInterval);
			};
		} else if (lottieResult && secondsLeft === 0) {
			setLottieResult(false);
		}
	}, [lottieResult, secondsLeft]);

	return (
		<>
			<div>
				<Dropdown isOpen={isOpen} toggle={toggle} />

				<Navbar toggle={toggle} />

				<Box className="contactBody">
					<Box className="contactOverlay">
						<Box className="titleBox" mb={8}>
							<div className="titleMsgText">
								<h1> Message me! </h1>
							</div>
						</Box>

						<Box className="form-container">
							<form action="" onSubmit={customSubmit}>
								<Stack
									direction="row"
									justifyContent={"space-evenly"}
									spacing={8}
									sx={{width: "100%"}}
								>
									<Stack direction="column" sx={{width: "50%"}}>
										<Stack direction="column">
											<label className="form-label">Name / Company</label>
											<input
												type="text"
												placeholder="Name/Company"
												name="name"
												value={name}
												required
												className="form-input"
												onChange={(e) => setName(e.target.value)}
											/>
										</Stack>
										<Stack direction="column">
											<label className="form-label"> Email</label>
											<input
												type="email"
												placeholder="Email Address"
												name="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
												className="form-input"
											/>
										</Stack>
										<Stack direction="column">
											<label className="form-label"> Subject </label>
											<input
												type="text"
												placeholder="Subject"
												name="subject"
												value={subject}
												onChange={(e) => setSubject(e.target.value)}
												required
												className="form-input"
											/>
										</Stack>
									</Stack>

									<Stack direction="column" sx={{width: "50%"}}>
										<Stack direction="column" className="form-input-field">
											<label className="form-label"> Message</label>
											<textarea
												placeholder="Your message"
												name="message"
												value={message}
												onChange={(e) => setMessage(e.target.value)}
												required
												className="form-textarea"
											></textarea>
										</Stack>
									</Stack>
								</Stack>

								<div className="form-row form-btn">
									<button> Send Message </button>
								</div>
							</form>
						</Box>
					</Box>
				</Box>
			</div>
			{result && lottieResult && (
				<div className="modal">
					<div className="submittedForm">
						<>
							<MsgDetail />
							<div id="timer" className="timer">
								{secondsLeft === 0
									? "Time is up!"
									: `Time left: ${secondsLeft}`}
							</div>
							<Confetti lottieResult={lottieResult} />
						</>
					</div>
				</div>
			)}
		</>
	);
};

export default Contact;
