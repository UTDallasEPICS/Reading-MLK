import nodemailer from 'nodemailer'

export const sendEmail = async ({
	to,
	subject,
	html,
}: {
	to: string
	subject: string
	html: string
}) => {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER, // user account
            pass: process.env.SMTP_APP_PASSWORD, // App password
        },
	})

	await transporter.sendMail({
		from: `"Reading Huddle Team" <${process.env.SMTP_USER}>`,
		to,
		subject,
		html,
	})
}