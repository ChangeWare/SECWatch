import React, {useEffect} from 'react';
import { useForm } from 'react-hook-form';
import Button  from '@/common/components/Button.tsx';
import { useAuth } from "@features/auth";
import { LoginFormData } from "@features/auth/types.ts";
import HyperLink from "@common/components/HyperLink.tsx";

interface LoginFormProps {
    onLoginSuccess: () => void;
}

export function LoginForm({onLoginSuccess}: LoginFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const {login, loginError, isLoggingIn, loginSuccess } = useAuth();

    const onSubmit = (data: LoginFormData) => {
        login(data);
    };

    useEffect(() => {
        if (loginSuccess) {
           onLoginSuccess();
        }
    }, [loginSuccess]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            { loginError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                    Invalid email or password
                </div>
            )}

            <div>
                <label className="block text-foreground mb-2">Email</label>
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
                    <p className="mt-1 text-error">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label className="block text-foreground mb-2">Password</label>
                <input
                    {...register('password', {
                        required: 'Password is required'
                    })}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    type="password"
                />
                {errors.password && (
                    <p className="mt-1 text-error">{errors.password.message}</p>
                )}
            </div>

            <div className={`flex items-center justify-between`}>
                <div className="flex items-center">
                    <input
                        {...register('rememberMe')}
                        type="checkbox"
                        className="mr-2"
                    />
                    <label className="text-ring">Remember me</label>
                </div>

                <HyperLink href="/forgot-password">Forgot password?</HyperLink>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isLoggingIn}
            >
                {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </Button>
        </form>
    );
}