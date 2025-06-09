import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields (Name, Email, Message).');
            return;
        }
        if (formData.phone && !/^\d{10,}$/.test(formData.phone)) { // Basic phone number validation (at least 10 digits)
            toast.error('Please enter a valid phone number (at least 10 digits).');
            return;
        }

        // Simulate form submission
        console.log('Form data submitted:', formData);
        toast.success('Thank you for your inquiry! We will get back to you shortly.');

        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
        });
    };

    return (
        <section className="ContactForm bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl mb-4">
                    Ready to find your dream property?
                </h2>
                <p className="mt-4 text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    Whether you're buying, selling, or just exploring, our team is here to help.
                    Contact us today to learn more about how we can assist you.
                </p>
                <div className="flex justify-center mb-12">
                    <ApperIcon className="w-24 h-24 text-primary-600" />
                </div>

                <div className="mt-12 bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                        <div>
                            <FormField
                                label="Full Name"
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <FormField
                                label="Email"
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <FormField
                                label="Phone Number"
                                id="phone"
                                name="phone"
                                type="text" // Keep as text for flexible input, validate later
                                autoComplete="tel"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <FormField
                                label="Message"
                                id="message"
                                name="message"
                                isTextArea
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Button
                                type="submit"
                                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;