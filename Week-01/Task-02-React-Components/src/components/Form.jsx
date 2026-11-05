import { useState } from "react";

function Form() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!name || !email || !message) {
            alert("Please fill all fields");
            return;
        }

        alert(`Thank you ${name}! Your message has been received.`);

        setName("");
        setEmail("");
        setMessage("");

    };

    return (

        <form className="contact-form" onSubmit={handleSubmit}>

            <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <textarea
                placeholder="Write your message..."
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
            />

            <button type="submit">
                Send Message →
            </button>

        </form>

    );

}

export default Form;