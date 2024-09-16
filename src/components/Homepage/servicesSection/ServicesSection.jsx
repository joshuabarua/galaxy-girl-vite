import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tv, Camera, Users} from 'lucide-react';

export default function ServicesSection() {
	const services = [
		{
			icon: <Tv className="h-8 w-8 mb-4 text-primary" />,
			title: 'Film & TV',
			description:
				'From Netflix dramas to ITV’s live segments, I bring narratives to life with my diverse skill set, adapting from subtle enhancements to vibrant transformations.',
		},
		{
			icon: <Camera className="h-8 w-8 mb-4 text-primary" />,
			title: 'Commercial & Editorial',
			description: 'Elevate your brand with impactful makeup for advertising campaigns, fashion shoots, and editorial projects that capture attention and inspire.',
		},
		{
			icon: <Users className="h-8 w-8 mb-4 text-primary" />,
			title: 'Workshops & Training',
			description: 'Join my transformative workshops where I share extensive knowledge in SFX, beauty, and character makeup, nurturing the next generation of artists.',
		},
	];

	return (
		<section className="w-full h-1/2 py-12 md:py-24 lg:py-32 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ">
			<div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 h-2/3  px-20">
				{services.map((service, index) => (
					<Card key={index} className="flex flex-col items-center text-center justify-center border-none  mt-8 md:mt-4">
						<CardHeader className="flex flex-col items-center text-center justify-center ">
							{service.icon}
							<CardTitle className="text-2xl" style={{fontFamily: 'Rowdies'}}>
								{service.title}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p style={{fontFamily: 'Rowdies'}}>{service.description}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
