import React, {useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { glassStyles, textStyles, layoutStyles } from '@/common/styles/components';
import type {RegistrationFormData} from '../types';
import Button from "@common/components/Button.tsx";
import {useAuth} from "@features/auth";
import {useNavigate} from "react-router-dom";

export function RegistrationForm() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegistrationFormData>();
    const { register: registerUser, isRegistering, registerSuccess } = useAuth();
    const password = watch('password');

    const navigate = useNavigate();

    useEffect(() => {
        if (registerSuccess) {
            navigate('/register-success');
        }

    }, [registerSuccess]);


    const onSubmit = (data: RegistrationFormData) => {
        registerUser(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block text-main-blue-light mb-2">Email</label>
                <input
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                        }
                    })}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    type="email"
                />
                {errors.email && (
                    <p className="mt-1 text-main-orange-light">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label className="block text-main-blue-light mb-2">First Name</label>
                <input
                    {...register('firstName', {
                        required: 'First name is required',
                        pattern: {
                            value: /^[A-Za-z]+$/i,
                            message: 'Invalid first name'
                        }
                    })}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    type="text"
                />
                {errors.firstName && (
                    <p className="mt-1 text-main-orange-light">{errors.firstName.message}</p>
                )}
            </div>

            <div>
                <label className="block text-main-blue-light mb-2">Last Name</label>
                <input
                    {...register('lastName', {
                        required: 'Last name is required',
                        pattern: {
                            value: /^[A-Za-z]+$/i,
                            message: 'Invalid last name'
                        }
                    })}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    type="text"
                />
                {errors.lastName && (
                    <p className="mt-1 text-main-orange-light">{errors.lastName.message}</p>
                )}
            </div>


            <div>
                <label className="block text-main-blue-light mb-2">Password</label>
                <input
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                        }
                    })}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    type="password"
                />
                {errors.password && (
                    <p className="mt-1 text-main-orange-light">{errors.password.message}</p>
                )}
            </div>

            <div>
                <label className="block text-main-blue-light mb-2">Confirm Password</label>
                <input
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value: string) => value === password || 'Passwords do not match'
                    })}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    type="password"
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-main-orange-light">{errors.confirmPassword.message}</p>
                )}
            </div>

            <div>
                <label className="block text-main-blue-light mb-2">Company Name (Optional)</label>
                <input
                    {...register('companyName')}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    type="text"
                />
            </div>

            <div className="flex items-center">
                <input
                    {...register('agreeToTerms', {
                        required: 'You must agree to the terms and conditions'
                    })}
                    type="checkbox"
                    className="mr-2"
                />
                <label className="text-main-blue-light">
                    I agree to the terms and conditions
                </label>
            </div>
            {errors.agreeToTerms && (
                <p className="mt-1 text-main-orange-light">{errors.agreeToTerms.message}</p>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isRegistering}
            >
                {isRegistering ? 'Creating Account...' : 'Create Account'}
            </Button>
        </form>
    );
}