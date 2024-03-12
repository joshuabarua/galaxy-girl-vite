import './fadeIn.css';
import React, {useRef, useEffect, useState} from 'react';

export default function FadeInSection(props) {
	const [isVisible, setVisible] = useState(true);
	const domRef = useRef();
	const {id} = props;

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => setVisible(entry.isIntersecting));
		});
		observer.observe(domRef.current);
		return () => {
			if (domRef.current) {
				observer.unobserve(domRef.current);
			}
		};
	}, []);
	return (
		<div className={`fade-in-section ${isVisible ? 'is-visible' : ''}`} style={{animationDelay: `${15 * id}s`}} ref={domRef}>
			{props.children}
		</div>
	);
}
