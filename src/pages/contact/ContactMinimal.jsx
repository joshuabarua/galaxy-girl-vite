import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { useFadeUpStagger } from "../../hooks/useFadeUpStagger";

const RATE_LIMIT_STORAGE_KEY = "contact-rate-limit-v1";
const RATE_LIMIT_COOLDOWN_MS = 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_PER_WINDOW = 3;

const defaultFormData = {
	name: "",
	email: "",
	service: "",
	timeline: "",
	location: "",
	message: "",
	website: "",
};

const ContactMinimal = () => {
	const [formData, setFormData] = useState(defaultFormData);
	const [status, setStatus] = useState({ type: "idle", message: "" });
	const [fieldErrors, setFieldErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setFieldErrors((prev) => ({ ...prev, [name]: "" }));
	};

	const validateForm = () => {
		const errors = {};
		if (!formData.name.trim()) {
			errors.name = "Please share your name.";
		}

		if (!formData.email.trim()) {
			errors.email = "Please add an email address.";
		} else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
			errors.email = "Please enter a valid email format.";
		}

		if (!formData.service) {
			errors.service = "Please pick a service type.";
		}

		if (!formData.message.trim()) {
			errors.message = "Please include a short project brief.";
		} else if (formData.message.trim().length < 20) {
			errors.message = "A few more details help. Minimum 20 characters.";
		}

		return errors;
	};

	const getRateLimitError = () => {
		if (typeof window === "undefined") return "";
		try {
			const now = Date.now();
			const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
			if (!raw) return "";

			const parsed = JSON.parse(raw);
			const submissions = Array.isArray(parsed?.submissions)
				? parsed.submissions.filter((value) => now - value < RATE_LIMIT_WINDOW_MS)
				: [];
			const lastSubmission = submissions[submissions.length - 1] || 0;

			if (lastSubmission && now - lastSubmission < RATE_LIMIT_COOLDOWN_MS) {
				const waitSeconds = Math.ceil(
					(RATE_LIMIT_COOLDOWN_MS - (now - lastSubmission)) / 1000,
				);
				return `Please wait ${waitSeconds}s before sending another message.`;
			}

			if (submissions.length >= RATE_LIMIT_MAX_PER_WINDOW) {
				return "Rate limit reached. Please try again in about an hour.";
			}

			return "";
		} catch {
			return "";
		}
	};

	const recordSubmission = () => {
		if (typeof window === "undefined") return;
		try {
			const now = Date.now();
			const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
			const parsed = raw ? JSON.parse(raw) : { submissions: [] };
			const submissions = Array.isArray(parsed?.submissions)
				? parsed.submissions.filter((value) => now - value < RATE_LIMIT_WINDOW_MS)
				: [];
			submissions.push(now);
			localStorage.setItem(
				RATE_LIMIT_STORAGE_KEY,
				JSON.stringify({ submissions }),
			);
		} catch {
			return;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		if (formData.website.trim()) {
			setStatus({
				type: "success",
				message: "Thanks for reaching out. Your message has been received.",
			});
			setFormData(defaultFormData);
			return;
		}

		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length) {
			setFieldErrors(validationErrors);
			setStatus({
				type: "error",
				message: "Please fix the highlighted fields and try again.",
			});
			return;
		}

		const rateLimitError = getRateLimitError();
		if (rateLimitError) {
			setStatus({ type: "error", message: rateLimitError });
			return;
		}

		setIsSubmitting(true);
		setStatus({ type: "sending", message: "Sending your message..." });

		try {
			const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
			const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
			const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC;

			if (!serviceId || !templateId || !publicKey) {
				throw new Error("Email service is not configured.");
			}

			const params = {
				from_name: formData.name.trim(),
				from_email: formData.email.trim(),
				subject: `Website enquiry (${formData.service})`,
				service_type: formData.service,
				timeline: formData.timeline || "Not provided",
				location: formData.location || "Not provided",
				message: formData.message.trim(),
				to_name: "Galaxy Girl Website",
			};

			await emailjs.send(serviceId, templateId, params, publicKey);
			recordSubmission();
			setStatus({
				type: "success",
				message: "Message sent. You should hear back within 1-2 business days.",
			});
			setFieldErrors({});
			setFormData(defaultFormData);
		} catch (err) {
			console.error("Email send failed:", err);
			setStatus({
				type: "error",
				message: "Could not send right now. Please retry or use Instagram/LinkedIn.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		document.documentElement.classList.remove("home-snap");
		document.body.classList.remove("home-snap");
		document.documentElement.classList.remove("oh");
		document.body.classList.remove("oh");
		document.body.style.overflowY = "auto";
		document.body.style.overflowX = "hidden";
		return () => {
			document.body.style.overflowY = "";
			document.body.style.overflowX = "";
		};
	}, []);

	useFadeUpStagger(".fade-up-item", {
		delay: 250,
		stagger: 70,
		duration: 600,
		distance: 40,
	});

	return (
		<div
			id="contact-minimal-bg"
			className="min-h-screen bg-[#f5f5f5] text-black overflow-x-hidden">
			<div className="page-shell px-4 sm:px-6 lg:px-10 2xl:px-16 3xl:px-24 4k:px-32 pb-14 sm:pb-16 lg:pb-20">
			<div className="mx-auto w-full max-w-[960px] md:max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] 4k:max-w-[1800px]">
				<header className="fade-up-item text-center mb-8">
					<h1
						className="text-[clamp(3.1rem,6.2vw,5.2rem)] font-normal tracking-[0.06em] leading-[0.88] mb-6 uppercase"
						style={{ fontFamily: '"EmpireColombia", "ZaiOlivettiLettera22", serif' }}>
						Get in Touch
					</h1>
					<p className="text-sm font-normal tracking-[0.2em] uppercase text-[#666] m-0">
						Project enquiries and bookings
					</p>
				</header>

				<div className="fade-up-item flex items-center justify-center gap-4 mb-6">
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-black no-underline font-light transition-opacity duration-300 w-fit hover:opacity-60"
						aria-label="Instagram">
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<rect
								x="2"
								y="2"
								width="20"
								height="20"
								rx="5"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<circle
								cx="12"
								cy="12"
								r="4"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
						</svg>
					</a>
					<a
						href="https://linkedin.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-black no-underline font-light transition-opacity duration-300 w-fit hover:opacity-60"
						aria-label="LinkedIn">
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<rect
								x="3"
								y="3"
								width="18"
								height="18"
								rx="2"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<rect x="7" y="10" width="2" height="7" fill="currentColor" />
							<circle cx="8" cy="7" r="1" fill="currentColor" />
							<path
								d="M13 17v-4a3 3 0 0 1 6 0v4h-2v-4a1 1 0 1 0-2 0v4h-2z"
								fill="currentColor"
							/>
						</svg>
					</a>
				</div>

				<div className="flex flex-col items-center justify-center gap-8">
					<form
						className="fade-up-item w-full max-w-[640px] mx-auto flex flex-col gap-6"
						onSubmit={handleSubmit}
						noValidate>
						<input
							type="text"
							name="website"
							value={formData.website}
							onChange={handleChange}
							autoComplete="off"
							tabIndex={-1}
							className="hidden"
							aria-hidden="true"
						/>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<div className="flex flex-col gap-2">
								<label
									htmlFor="name"
									className="text-xs font-normal tracking-[0.2em] uppercase text-[#888]">
									Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									aria-invalid={Boolean(fieldErrors.name)}
									className="w-full p-4 text-base font-light text-black bg-[#fafafa] border border-brand/20 outline-none focus:border-brand"
								/>
								{fieldErrors.name && (
									<p className="text-xs text-[#8f3059]">{fieldErrors.name}</p>
								)}
							</div>

							<div className="flex flex-col gap-2">
								<label
									htmlFor="email"
									className="text-xs font-normal tracking-[0.2em] uppercase text-[#888]">
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									aria-invalid={Boolean(fieldErrors.email)}
									className="w-full p-4 text-base font-light text-black bg-[#fafafa] border border-brand/20 outline-none focus:border-brand"
								/>
								{fieldErrors.email && (
									<p className="text-xs text-[#8f3059]">{fieldErrors.email}</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<div className="flex flex-col gap-2">
								<label
									htmlFor="service"
									className="text-xs font-normal tracking-[0.2em] uppercase text-[#888]">
									Service type
								</label>
								<select
									id="service"
									name="service"
									value={formData.service}
									onChange={handleChange}
									required
									aria-invalid={Boolean(fieldErrors.service)}
									className="w-full p-4 text-base font-light text-black bg-[#fafafa] border border-brand/20 outline-none focus:border-brand">
									<option value="">Select service</option>
									<option value="Editorial">Editorial</option>
									<option value="Bridal">Bridal</option>
									<option value="SFX">SFX</option>
									<option value="Film/TV">Film / TV</option>
									<option value="Other">Other</option>
								</select>
								{fieldErrors.service && (
									<p className="text-xs text-[#8f3059]">{fieldErrors.service}</p>
								)}
							</div>

							<div className="flex flex-col gap-2">
								<label
									htmlFor="timeline"
									className="text-xs font-normal tracking-[0.2em] uppercase text-[#888]">
									Timeline
								</label>
								<input
									type="text"
									id="timeline"
									name="timeline"
									value={formData.timeline}
									onChange={handleChange}
									placeholder="e.g. Mid June"
									className="w-full p-4 text-base font-light text-black bg-[#fafafa] border border-brand/20 outline-none focus:border-brand"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="location"
								className="text-xs font-normal tracking-[0.2em] uppercase text-[#888]">
								Location
							</label>
							<input
								type="text"
								id="location"
								name="location"
								value={formData.location}
								onChange={handleChange}
								placeholder="City or studio"
								className="w-full p-4 text-base font-light text-black bg-[#fafafa] border border-brand/20 outline-none focus:border-brand"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="message"
								className="text-xs font-normal tracking-[0.2em] uppercase text-[#888]">
								Message
							</label>
							<textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleChange}
								required
								rows="6"
								aria-invalid={Boolean(fieldErrors.message)}
								className="w-full p-4 text-base font-light text-black bg-[#fafafa] border border-brand/20 outline-none focus:border-brand resize-y min-h-[160px]"
							/>
							<div className="flex items-center justify-between gap-3 text-xs text-[#888]">
								<span>
									Share project goals, references, and event details for a faster quote.
								</span>
								<span>{formData.message.trim().length} chars</span>
							</div>
							{fieldErrors.message && (
								<p className="text-xs text-[#8f3059]">{fieldErrors.message}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-fit px-12 py-4 text-sm font-normal tracking-[0.1em] uppercase text-white bg-black border border-black transition-all duration-300 self-center hover:bg-white hover:text-black disabled:opacity-60 disabled:cursor-not-allowed">
							{isSubmitting ? "Sending..." : "Send Message"}
						</button>

						{status.message && (
							<p
								role="status"
								aria-live="polite"
								className={`text-sm m-0 p-4 border ${
									status.type === "success"
										? "text-[#1f613f] bg-[#edf7f0] border-[#b7d7c0]"
										: status.type === "error"
											? "text-[#8f3059] bg-[#fdeff5] border-[#f3c8da]"
											: "text-black bg-[#f5f5f5] border-brand/15"
								}`}>
								{status.message}
							</p>
						)}

						<p className="text-center text-xs tracking-[0.16em] uppercase text-[#777]">
							Replies within 1-2 business days.
						</p>
					</form>
				</div>
			</div>
			</div>
		</div>
	);
};

export default ContactMinimal;
