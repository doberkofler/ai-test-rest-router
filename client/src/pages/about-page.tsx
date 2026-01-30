import React, {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {ServerInfoSchema} from '@shared/schemas';
import type {ServerInfo} from '@shared/schemas';

/**
 * Fetches server information and validates with Zod.
 */
const fetchServerInfo = async (): Promise<ServerInfo> => {
	const res = await fetch('http://localhost:3001/api/info', {
		credentials: 'include',
	});
	if (res.ok) {
		const data: unknown = await res.json();
		return ServerInfoSchema.parse(data);
	}
	throw new Error(`HTTP error! status: ${res.status.toString()}`);
};

/**
 * About page component displaying system and version information.
 * @returns React component.
 */
export const AboutPage: React.FC = () => {
	const [clientTime, setClientTime] = useState(new Date().toISOString());

	const {
		data: serverInfo,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['serverInfo'],
		queryFn: fetchServerInfo,
		refetchInterval: 5000,
	});

	useEffect(() => {
		const timer = setInterval(() => {
			setClientTime(new Date().toISOString());
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<div>
			<h1>About</h1>

			<section>
				<h2>Client Information</h2>
				<ul>
					<li>Build Timestamp: {__BUILD_TIMESTAMP__}</li>
					<li>Current Time: {clientTime}</li>
					<li>React Version: {React.version}</li>
				</ul>
			</section>

			<section>
				<h2>Server Information</h2>
				{error instanceof Error && <p style={{color: 'red'}}>Error: {error.message}</p>}
				{isLoading ? (
					<p>Loading server info...</p>
				) : (
					serverInfo && (
						<ul>
							<li>Start Timestamp: {serverInfo.startTimestamp}</li>
							<li>Current Time: {serverInfo.serverTime}</li>
							<li>Node Version: {serverInfo.nodeVersion}</li>
							<li>Express Version: {serverInfo.expressVersion}</li>
						</ul>
					)
				)}
			</section>
		</div>
	);
};
