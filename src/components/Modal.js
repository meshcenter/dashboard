import React from "react";

import Button from "./Button2";

export default function ({
	title,
	buttonLabel = "Done",
	children,
	onClick,
	onCancel,
}) {
	return (
		<div className="absolute absolute--fill bg-white-70 z-5">
			<div
				className="bg-white mw6 w-100 center shadow br2"
				style={{ marginTop: "15vh" }}
			>
				<div className="pa3 f5 fw5">{title}</div>
				<div className="pa3 bg-near-white">{children}</div>
				<div className="pa3 flex justify-end">
					<div className="ml2">
						<Button label="Cancel" onClick={onCancel} />
					</div>
					<div className="ml2">
						<Button
							primary
							label={buttonLabel}
							type="submit"
							onClick={onClick}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}