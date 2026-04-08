import './Contact.css'
import React from 'react';
import { toast } from 'react-toastify'

const ContactUs = () => {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    // Use environment key if available (Vite requires VITE_ prefix), fallback to the hardcoded key
    const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '424fb118-9262-4153-b47a-d4c954b0ae80';

    // Ensure access_key is present and overwrite any hidden input
    formData.set('access_key', WEB3FORMS_KEY);

    // Optional: set a subject so emails/readable logs include context
    const name = formData.get('name') || 'Anonymous';
    formData.set('subject', `New contact from ${name}`);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult('Form Submitted Successfully');
        toast.success('Sent successfully');
        event.target.reset();
      } else {
        console.error('web3forms error', response.status, data);
        toast.error('Failed to send message. Check console for details.');
        setResult(data.message || `Error ${response.status}`);
      }
    } catch (err) {
      console.error('Network or unexpected error sending form', err);
      toast.error('Failed to send message. Network error.');
      setResult('Network error');
    }
  };

  return (
    <section className="py-2">
      <div className="container ">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="contact-form">
              <h2 className="mb-4">Get in Touch</h2>
              <form onSubmit={onSubmit}>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input type="text" className="form-control" id="name" name="name" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Your Email</label>
                  <input type="email" className="form-control" id="email" name="email" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Your Message</label>
                  <textarea className="form-control" id="message" name="message" rows="5" required></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs
