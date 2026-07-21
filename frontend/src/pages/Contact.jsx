import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    toast.success('Your message has been sent successfully!')
    reset()
  }

  return (
    <div className="container-app py-12 animate-fade-in max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="page-title mb-2">Contact Us</h1>
        <p className="text-gray-500 text-sm">Have questions or feedback? We would love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info panel */}
        <div className="space-y-4">
          <div className="card p-5 space-y-3 bg-gray-50 border-0">
            <h3 className="font-semibold text-gray-900 text-sm">Our Location</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Rural Artisan Marketplace<br />
              New Delhi, India 110001
            </p>
          </div>

          <div className="card p-5 space-y-3 bg-gray-50 border-0">
            <h3 className="font-semibold text-gray-900 text-sm">Email Support</h3>
            <p className="text-xs text-gray-500">
              support@artisanmarket.in<br />
              info@artisanmarket.in
            </p>
          </div>

          <div className="card p-5 space-y-3 bg-gray-50 border-0">
            <h3 className="font-semibold text-gray-900 text-sm">Call Center</h3>
            <p className="text-xs text-gray-500">
              +91 12345 67890<br />
              Monday to Saturday: 9am - 6pm
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-6 md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Rahul Verma"
                  className={`form-input ${errors.name ? 'border-red-400' : ''}`}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="rahul@example.com"
                  className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
                  })}
                />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                placeholder="Product Inquiry / General Feedback"
                className={`form-input ${errors.subject ? 'border-red-400' : ''}`}
                {...register('subject', { required: 'Subject is required' })}
              />
              {errors.subject && <p className="form-error">{errors.subject.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-msg">Message</label>
              <textarea
                id="contact-msg"
                rows={5}
                placeholder="Type your message here..."
                className={`form-input resize-none ${errors.message ? 'border-red-400' : ''}`}
                {...register('message', { required: 'Message is required' })}
              />
              {errors.message && <p className="form-error">{errors.message.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary w-full sm:w-auto">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
