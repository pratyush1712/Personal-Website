interface EmailTemplateProps {
	fullName: string;
	email: string;
	message: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ fullName, email, message }) => {
	return (
		<div
			style={{
				padding: "2rem",
				fontFamily: "Arial, sans-serif",
				backgroundColor: "#f9f9f9",
				border: "1px solid #ddd",
				borderRadius: "8px",
				maxWidth: "600px",
				margin: "auto",
				boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
			}}>
			<h2
				style={{
					color: "#333",
					borderBottom: "2px solid #3279CB",
					paddingBottom: "0.5rem"
				}}>
				You have a new message from {fullName} 📬
			</h2>
			<div style={{ marginBottom: "1rem" }}>
				<strong style={{ color: "#3279CB" }}>Name:</strong> <span style={{ color: "#333" }}>{fullName}</span>
			</div>
			<div style={{ marginBottom: "1rem" }}>
				<strong style={{ color: "#3279CB" }}>Email:</strong> <span style={{ color: "#333" }}>{email}</span>
			</div>
			<div style={{ marginBottom: "1rem" }}>
				<p style={{ color: "#333", lineHeight: "1.5" }}>
					<strong style={{ color: "#3279CB" }}>Message:</strong> {message}
				</p>
			</div>
		</div>
	);
};

export default EmailTemplate;
