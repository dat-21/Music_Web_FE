import { useEffect, useMemo, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import config from '@/config';

interface FeatureItem {
    title: string;
    description: string;
}

interface PricingItem {
    name: string;
    price: string;
    subtitle: string;
    bullets: string[];
    highlighted?: boolean;
}

interface StatItem {
    label: string;
    value: string;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    alpha: number;
}

const FEATURES: FeatureItem[] = [
    {
        title: 'MoodWheel Discovery',
        description: 'Spin your mood into instant playlists tuned for focus, chill, or late-night energy.',
    },
    {
        title: 'Offline Listening',
        description: 'Keep your favorite tracks downloaded and available, even when your signal drops.',
    },
    {
        title: 'Hi-Fi Quality',
        description: 'Hear every detail with crystal playback and low-latency streaming across devices.',
    },
    {
        title: 'Cross-Device Sync',
        description: 'Start on your laptop, continue on mobile, and resume right where you left off.',
    },
];

const PRICING: PricingItem[] = [
    {
        name: 'Free',
        price: '$0',
        subtitle: 'Always free',
        bullets: ['Ad-supported listening', 'Standard quality', 'Limited skips', 'Basic playlist features'],
    },
    {
        name: 'Premium',
        price: '$7.99',
        subtitle: 'per month',
        bullets: ['No ads, no interruptions', 'Hi-Fi audio quality', 'Unlimited skips', 'Offline downloads'],
        highlighted: true,
    },
];

const SOCIAL_STATS: StatItem[] = [
    { value: '18M+', label: 'active users' },
    { value: '12.4M', label: 'Loved by listeners' },
    { value: '4.9/5', label: 'average rating' },
];

const LandingPage = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const particles: Particle[] = [];
        const maxParticles = 58;
        let animationId = 0;
        let width = 0;
        let height = 0;
        let dpr = 1;

        const createParticle = (): Particle => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.24,
            vy: (Math.random() - 0.5) * 0.24,
            radius: Math.random() * 1.7 + 0.4,
            alpha: Math.random() * 0.35 + 0.25,
        });

        const syncCanvas = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);

            particles.length = 0;
            for (let i = 0; i < maxParticles; i += 1) {
                particles.push(createParticle());
            }
        };

        const draw = () => {
            context.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i += 1) {
                const particle = particles[i];

                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < -20) particle.x = width + 20;
                if (particle.x > width + 20) particle.x = -20;
                if (particle.y < -20) particle.y = height + 20;
                if (particle.y > height + 20) particle.y = -20;

                context.beginPath();
                context.fillStyle = `rgba(0, 229, 255, ${particle.alpha})`;
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fill();
            }

            for (let i = 0; i < particles.length; i += 1) {
                const first = particles[i];
                for (let j = i + 1; j < particles.length; j += 1) {
                    const second = particles[j];
                    const dx = first.x - second.x;
                    const dy = first.y - second.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 120) continue;

                    const alpha = (1 - distance / 120) * 0.13;
                    context.beginPath();
                    context.strokeStyle = `rgba(179, 136, 255, ${alpha})`;
                    context.lineWidth = 0.8;
                    context.moveTo(first.x, first.y);
                    context.lineTo(second.x, second.y);
                    context.stroke();
                }
            }

            animationId = window.requestAnimationFrame(draw);
        };

        syncCanvas();
        draw();

        window.addEventListener('resize', syncCanvas);

        return () => {
            window.cancelAnimationFrame(animationId);
            window.removeEventListener('resize', syncCanvas);
        };
    }, []);

    const stars = useMemo(() => '★★★★★', []);
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    if (isAuthenticated) {
        return <Navigate to={config.routes.home} replace />;
    }

    return (
        <div
            className="relative min-h-screen overflow-x-hidden"
            style={{
                background:
                    'radial-gradient(circle at 10% -20%, rgba(0,229,255,0.18) 0%, rgba(5,7,15,0) 36%), radial-gradient(circle at 90% -10%, rgba(179,136,255,0.2) 0%, rgba(5,7,15,0) 34%), linear-gradient(180deg, #03050d 0%, #060a16 52%, #03050d 100%)',
                color: 'var(--color-text-primary)',
            }}
        >
            <style>
                {`
                    @keyframes landing-float {
                        0% { transform: translateY(0px) translateX(0px) scale(1); }
                        50% { transform: translateY(-12px) translateX(8px) scale(1.04); }
                        100% { transform: translateY(0px) translateX(0px) scale(1); }
                    }

                    @keyframes landing-orbit {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    @keyframes landing-grid-shift {
                        0% { background-position: 0 0, 0 0; }
                        100% { background-position: 120px 120px, 0 0; }
                    }
                `}
            </style>

            <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />

            <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
                <div
                    className="absolute -left-24 top-28 h-72 w-72 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(0,229,255,0.18) 0%, rgba(0,229,255,0) 70%)',
                        animation: 'landing-float 9s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute -right-18 top-56 h-80 w-80 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(179,136,255,0.2) 0%, rgba(179,136,255,0) 72%)',
                        animation: 'landing-float 11s ease-in-out infinite reverse',
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '84px 84px',
                        maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 100%)',
                        animation: 'landing-grid-shift 22s linear infinite',
                    }}
                />
            </div>

            <nav className="sticky top-0 z-30 border-b border-white/10 bg-[#050710]/70 backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{
                                background: 'var(--color-accent-neon)',
                                boxShadow: '0 0 12px rgba(0,229,255,0.75)',
                            }}
                        />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em' }}>
                            Melody
                        </span>
                    </div>

                    <div className="hidden items-center gap-7 md:flex">
                        <a href="#features" className="text-sm text-white/75 transition hover:text-white">
                            Features
                        </a>
                        <a href="#premium" className="text-sm text-white/75 transition hover:text-white">
                            Premium
                        </a>
                        <a href="#about" className="text-sm text-white/75 transition hover:text-white">
                            About
                        </a>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to={config.routes.login}
                            className="rounded-full px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                        >
                            Log in
                        </Link>
                        <Link
                            to={config.routes.register}
                            className="rounded-full px-4 py-2 text-sm font-semibold"
                            style={{
                                background: 'var(--gradient-accent-neon)',
                                color: 'var(--color-bg-primary)',
                                boxShadow: '0 10px 20px rgba(0,229,255,0.24)',
                            }}
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-16 pt-20 text-center md:px-6 lg:px-8 lg:pt-24">
                    <div
                        className="pointer-events-none mb-6 h-16 w-16 rounded-full"
                        style={{
                            border: '1px solid rgba(0,229,255,0.4)',
                            boxShadow: '0 0 24px rgba(0,229,255,0.28), inset 0 0 12px rgba(179,136,255,0.18)',
                            animation: 'landing-orbit 16s linear infinite',
                        }}
                    />

                    <h1
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2.1rem, 7vw, 4.7rem)',
                            lineHeight: 1.02,
                            letterSpacing: '-0.02em',
                            margin: 0,
                            textWrap: 'balance',
                        }}
                    >
                        Your music universe, redefined
                    </h1>

                    <p
                        style={{
                            margin: '1rem 0 0 0',
                            maxWidth: '700px',
                            color: 'var(--color-text-secondary)',
                            fontSize: 'clamp(1rem, 2.2vw, 1.18rem)',
                        }}
                    >
                        Discover every mood, every moment, and every sound with a neon-first listening experience built
                        for focus, flow, and late-night sessions.
                    </p>

                    <div className="mt-8">
                        <Link
                            to={config.routes.register}
                            className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-bold"
                            style={{
                                background: 'var(--gradient-accent-neon)',
                                color: 'var(--color-bg-primary)',
                                boxShadow: '0 14px 30px rgba(0,229,255,0.28)',
                            }}
                        >
                            Start listening free
                        </Link>
                    </div>
                </section>

                <section id="features" className="mx-auto w-full max-w-7xl px-4 pb-8 md:px-6 lg:px-8">
                    <h2 style={{ margin: '0 0 1rem 0', fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)' }}>
                        Feature Showcase
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {FEATURES.map((feature, index) => (
                            <article
                                key={feature.title}
                                className="rounded-2xl border p-4"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    borderColor: 'rgba(255,255,255,0.12)',
                                }}
                            >
                                <div
                                    className="mb-3 h-9 w-9 rounded-lg"
                                    style={{
                                        background:
                                            index % 2 === 0
                                                ? 'linear-gradient(135deg, rgba(0,229,255,0.28), rgba(0,229,255,0.08))'
                                                : 'linear-gradient(135deg, rgba(179,136,255,0.3), rgba(179,136,255,0.1))',
                                    }}
                                />
                                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700 }}>{feature.title}</h3>
                                <p style={{ margin: '0.6rem 0 0 0', color: 'var(--color-text-secondary)' }}>
                                    {feature.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
                    <div
                        className="rounded-2xl border p-5 md:p-6"
                        style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)' }}
                    >
                        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                            Loved by <strong style={{ color: 'var(--color-text-primary)' }}>12 million listeners</strong>
                        </p>
                        <p
                            style={{
                                margin: '0.35rem 0 0 0',
                                color: '#ffd578',
                                letterSpacing: '0.22em',
                                fontSize: '1.05rem',
                            }}
                        >
                            {stars}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            {SOCIAL_STATS.map((stat) => (
                                <article
                                    key={stat.label}
                                    className="rounded-xl border p-3"
                                    style={{
                                        background: 'rgba(5,7,15,0.6)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                    }}
                                >
                                    <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{stat.value}</p>
                                    <p style={{ margin: '0.2rem 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                        {stat.label}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="premium" className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
                    <h2 style={{ margin: '0 0 1rem 0', fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)' }}>
                        Pricing
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        {PRICING.map((plan) => (
                            <article
                                key={plan.name}
                                className="rounded-2xl border p-5"
                                style={{
                                    background: plan.highlighted ? 'rgba(0,229,255,0.09)' : 'rgba(255,255,255,0.04)',
                                    borderColor: plan.highlighted
                                        ? 'rgba(0,229,255,0.5)'
                                        : 'rgba(255,255,255,0.12)',
                                    boxShadow: plan.highlighted
                                        ? '0 0 0 1px rgba(0,229,255,0.2), 0 12px 28px rgba(0,229,255,0.18)'
                                        : 'none',
                                }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 800 }}>{plan.name}</h3>
                                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)' }}>
                                            {plan.subtitle}
                                        </p>
                                    </div>
                                    {plan.highlighted && (
                                        <span
                                            className="rounded-full px-2.5 py-1 text-xs font-semibold"
                                            style={{
                                                background: 'var(--gradient-accent-neon)',
                                                color: 'var(--color-bg-primary)',
                                            }}
                                        >
                                            Most popular
                                        </span>
                                    )}
                                </div>

                                <p
                                    style={{
                                        margin: '0.9rem 0 0 0',
                                        fontSize: '2.1rem',
                                        fontFamily: 'var(--font-display)',
                                        fontWeight: 700,
                                    }}
                                >
                                    {plan.price}
                                </p>

                                <ul className="mt-3 space-y-2">
                                    {plan.bullets.map((bullet) => (
                                        <li key={bullet} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to={config.routes.register}
                                    className="mt-5 inline-flex rounded-full px-4 py-2.5 text-sm font-semibold"
                                    style={{
                                        background: plan.highlighted
                                            ? 'var(--gradient-accent-neon)'
                                            : 'rgba(255,255,255,0.08)',
                                        color: plan.highlighted
                                            ? 'var(--color-bg-primary)'
                                            : 'var(--color-text-primary)',
                                    }}
                                >
                                    {plan.highlighted ? 'Upgrade to Premium' : 'Start Free'}
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <footer id="about" className="relative z-10 mt-6 border-t border-white/10 px-4 py-8 md:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
                    <div>
                        <p style={{ margin: 0, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Melody</p>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            Sound crafted for your universe.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
                        <a href="#features" className="transition hover:text-white">
                            Features
                        </a>
                        <a href="#premium" className="transition hover:text-white">
                            Premium
                        </a>
                        <Link to={config.routes.login} className="transition hover:text-white">
                            Log in
                        </Link>
                        <Link to={config.routes.register} className="transition hover:text-white">
                            Sign up
                        </Link>
                    </div>

                    <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        Copyright {currentYear} Melody. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
