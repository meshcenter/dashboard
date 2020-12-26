import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "./Auth0";
import NodeName from "./NodeName";
import Device from "./Device";

export default function ResourceDetail(props) {
	const [resource, setResource] = useState({});

	const {
		resourceName,
		resourceId,
		titleExtractor,
		renderers,
		blacklist,
	} = props;
	const { isAuthenticated, getTokenSilently } = useAuth0();

	useEffect(() => {
		async function fetchData() {
			setResource({});
			const resource = await fetchResource(resourceName);
			setResource(resource);
			async function fetchResource() {
				const path = `${process.env.REACT_APP_API_ROOT}/${resourceName}/${resourceId}`;
				const token = await getTokenSilently();
				const options = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
				try {
					const res = await fetch(path, options);
					if (res.status !== 200) throw Error(res.error);
					return await res.json();
				} catch (error) {
					alert(`Failed to fetch ${resourceName}`);
					return [];
				}
			}
		}
		if (!isAuthenticated) return;
		fetchData();
	}, [isAuthenticated, getTokenSilently, resourceName, resourceId]);

	if (Object.keys(resource).length === 0) return null;

	return (
		<div className="w-100 ph3">
			<div className="flex items-center justify-between ">
				<h1 className="mv0 f3 fw7 ttc pv3">
					{titleExtractor && resource.id
						? titleExtractor(resource)
						: null}
				</h1>
			</div>
			{renderResource(resource, renderers, blacklist)}
		</div>
	);
}

function renderResource(resource, renderers = {}, blacklist = []) {
	const resourceKeys = Object.keys(resource);
	return (
		<div className="f6">
			{resourceKeys
				.filter((key) => !key.includes("_id"))
				.filter((key) => !blacklist.includes(key))
				.map((key) => {
					const value = resource[key];

					if (renderers[key] && !Array.isArray(value))
						return (
							<div key={key} className="flex items-start mv2">
								<div
									className="w4"
									style={{ minWidth: "8rem" }}
								>
									<span className="mid-gray">{key}</span>
								</div>
								<span className="dark-gray">
									{renderers[key](value)}
								</span>
							</div>
						);

					if (!value)
						return (
							<div key={key} className="flex items-start mv2">
								<div
									className="w4"
									style={{ minWidth: "8rem" }}
								>
									<span className="mid-gray">{key}</span>
								</div>
								<span className="light-silver">No {key}</span>
							</div>
						);

					switch (typeof value) {
						case "string":
							return (
								<div key={key} className="flex items-start mv2">
									<div
										className="w4"
										style={{ minWidth: "8rem" }}
									>
										<span className="mid-gray">{key}</span>
									</div>
									<span className="dark-gray">{value}</span>
								</div>
							);
						case "boolean":
							return (
								<div key={key} className="flex items-start mv2">
									<div
										className="w4"
										style={{ minWidth: "8rem" }}
									>
										<span className="mid-gray">{key}</span>
									</div>
									<span className="dark-gray">
										{value ? "✅" : "❌"}
									</span>
								</div>
							);
						case "object":
							if (
								Array.isArray(value) &&
								!value.filter((v) => v).length
							)
								return null;
							return (
								<div key={key} className="pv3">
									<h2 className="f5 fw5 mt0 mb3 ttc">
										{key}
									</h2>
									<div>
										{renderers[key] ? (
											renderers[key](value)
										) : Array.isArray(value) ? (
											<div className="">
												{value
													.filter((v) => v)
													.map((value) => {
														if (key === "nodes")
															return (
																<Link
																	key={
																		value.id
																	}
																	to={`/nodes/${value.id}`}
																	className="mr1 link dark-gray"
																>
																	<NodeName
																		node={
																			value
																		}
																	/>
																</Link>
															);

														if (key === "requests")
															return (
																<Link
																	key={
																		value.id
																	}
																	to={`/requests/${value.id}`}
																	className="mr1 link dark-gray w-100"
																>
																	{value.building
																		? value
																				.building
																				.address
																		: value.id}
																</Link>
															);

														if (key === "devices")
															return (
																<div>
																	<Device
																		device={
																			value
																		}
																	/>
																</div>
															);

														if (key === "panoramas")
															return (
																<div>
																	<img
																		alt="rooftop panorama"
																		className="w-100 mw6"
																		src={
																			value.url
																		}
																	/>
																</div>
															);

														return (
															<pre>
																{JSON.stringify(
																	value,
																	null,
																	2
																)}
															</pre>
														);
													})}
											</div>
										) : (
											renderResource(value, renderers)
										)}
									</div>
								</div>
							);
						default:
							return (
								<div key={key} className="flex items-start mv2">
									<div
										className="w4"
										style={{ minWidth: "8rem" }}
									>
										<span className="mid-gray">{key}</span>
									</div>
									<span className="dark-gray">{value}</span>
								</div>
							);
					}
				})}
		</div>
	);
}
