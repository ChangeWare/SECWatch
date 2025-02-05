import React, {useState} from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@common/components/Card";
import { Mail, MessageSquare, User } from "lucide-react";
import Button from "@common/components/Button";
import { layoutStyles, textStyles } from "@common/styles/components";
import {Form, useForm} from "react-hook-form";
import Input from "@common/components/Input.tsx";
import {Textarea} from "@common/components/Textarea.tsx";
import {toast} from "react-toastify";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";


interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export default function ContactView() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ContactFormData>({
        defaultValues: {
            name: "",
            email: "",
            message: ""
        }
    });

    const WEB3FORMS_KEY = '40fd8204-6f64-45c8-8902-44aafcc0fd82';

    const onSubmit = async (data: ContactFormData) => {
        try {
            setIsSubmitting(true);

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    access_key: WEB3FORMS_KEY,
                    subject: `New contact from ${data.name}`,
                })
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Message sent successfully!");
                form.reset();
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="py-12">
            <div className={layoutStyles.contentSection}>
                <div className="max-w-3xl mx-auto">
                    <h1 className={`${textStyles.heading} text-center mb-6`}>
                        Contact Us
                    </h1>
                    <p className={`${textStyles.paragraph} text-center mb-12`}>
                        Have questions or feedback? We're here to help.
                    </p>

                    <Card>
                        <CardHeader>
                            <CardTitle>Send us a message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LoadingIndicator isLoading={isSubmitting}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-secondary" />
                                                    <Input
                                                        placeholder="Your name"
                                                        className="pl-10"
                                                        required
                                                        {...form.register('name')}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-secondary" />
                                                    <Input
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        className="pl-10"
                                                        required
                                                        {...form.register('email')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Message</label>
                                            <div className="relative">
                                                <MessageSquare className="absolute left-3 top-2.5 h-5 w-5 text-secondary" />
                                                <Textarea
                                                    placeholder="How can we help?"
                                                    className="min-h-[120px] pl-10"
                                                    required
                                                    {...form.register('message')}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button type="submit" size="lg">
                                                Send Message
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </LoadingIndicator>
                        </CardContent>
                    </Card>

                    <div className="mt-12 grid md:grid-cols-2 gap-6">
                        <Card variant="subtle">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">Support</h3>
                                <p className="text-secondary mb-4">
                                    Need technical help? Check our documentation or reach out to support.
                                </p>
                                <Button variant="info" to="#">
                                    Coming Soon!
                                </Button>
                            </CardContent>
                        </Card>

                        <Card variant="subtle">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">Community</h3>
                                <p className="text-secondary mb-4">
                                    Join our community to connect with other users and share insights.
                                </p>
                                <Button variant="info" to="#">
                                    Coming soon!
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}