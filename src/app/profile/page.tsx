"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import Header from "@frontend/components/Navigation/Header";
import styles from "./profile.module.css";
import { Star, Camera, Save, Sparkles, Edit3, X, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import Image from "next/image";

const PALETTE_COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6",
    "#06b6d4", "#0ea5e9", "#2563eb", "#4f46e5", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
    "#ec4899", "#f43f5e", "#64748b", "#1e293b", "#78350f", "#4c1d95", "#064e3b", "#450a0a"
];

const ZODIAC_SIGNS = [
    { name: "Capricorn", symbol: "♑" }, { name: "Aquarius", symbol: "♒" }, 
    { name: "Pisces", symbol: "♓" }, { name: "Aries", symbol: "♈" }, 
    { name: "Taurus", symbol: "♉" }, { name: "Gemini", symbol: "♊" }, 
    { name: "Cancer", symbol: "♋" }, { name: "Leo", symbol: "♌" }, 
    { name: "Virgo", symbol: "♍" }, { name: "Libra", symbol: "♎" }, 
    { name: "Scorpio", symbol: "♏" }, { name: "Sagittarius", symbol: "♐" }
];

const INITIAL_PROFILE = {
    realName: "",
    fathersName: "",
    mothersName: "",
    dob: "",
    school: "",
    bloodGroup: "",
    zodiacSign: "",
    address: "",
    favColor: "",
    favColorCode: "",
    favFood: "",
    favPlace: "",
    favBook: "",
    hobbies: "",
    personalGoals: "",
    picture: ""
};

export default function ProfilePage() {
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    const { register, handleSubmit: handleFormSubmit, setValue, watch, reset } = useForm({ defaultValues: INITIAL_PROFILE });
    const profile = watch();

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                try {
                    const res = await fetch("/api/profile");
                    const data = await res.json();
                    if (data.profile) {
                        reset({ ...INITIAL_PROFILE, ...data.profile });
                    }
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                } finally {
                    setFetching(false);
                }
            };
            fetchProfile();
        }
    }, [user, reset]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const profileRes = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (profileRes.ok) {
                setMessage({ type: "success", text: "Journal updated successfully!" });
                setIsEditing(false);
                            } else {
                setMessage({ type: "error", text: "Failed to update journal" });
            }
        } catch {
            setMessage({ type: "error", text: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };


    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMessage({ type: "info", text: "Processing photo..." });
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue("picture", reader.result as string);
                setMessage({ type: "success", text: "Photo uploaded! Don't forget to save your journal." });
            };
            reader.onerror = () => {
                setMessage({ type: "error", text: "Failed to read photo." });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user) return null;

    const renderViewField = (label: string, value: string) => (
        <div className={styles.viewField}>
            <div className={styles.viewLabel}>{label}</div>
            <div className={styles.viewValue}>{value || "Not set yet..."}</div>
        </div>
    );

    return (
        <div className={styles.container}>
            <Header />

            <div className={`${styles.profileSheet} animate-fade-in`}>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={styles.editToggle}
                    type="button"
                >
                    {isEditing ? <><X size={18} /> Cancel</> : <><Edit3 size={18} /> Edit Profile</>}
                </button>

                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h1>All About Me! <Sparkles size={32} style={{ color: '#facc15', display: 'inline', verticalAlign: 'middle' }} /></h1>
                        <p>My Personal Journal & Diary Records</p>
                    </div>
                    <div className={styles.photoFrame} onClick={() => isEditing && fileInputRef.current?.click()}>
                        {profile.picture ? (
                            <Image src={profile.picture as string} alt="Profile" width={200} height={200} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <>
                                <Camera size={32} />
                                <span>{isEditing ? "Upload Photo" : "No Picture"}</span>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handlePhotoUpload}
                        />
                    </div>
                </div>

                {fetching ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                        <Star size={32} className="animate-spin" style={{ margin: '0 auto 10px' }} />
                        <p>Opening your journal...</p>
                    </div>
                ) : !isEditing ? (
                    <div className={styles.viewSection}>
                        <div className={styles.section}>
                            <h2>Personal Details</h2>
                            {renderViewField("My Full Name", profile.realName)}
                            {renderViewField("Father's Name", profile.fathersName)}
                            {renderViewField("Mother's Name", profile.mothersName)}
                            <div className={styles.viewField}>
                                <div className={styles.viewLabel}>Zodiac Sign</div>
                                <div className={styles.viewValue}>
                                    {ZODIAC_SIGNS.find(z => z.name === profile.zodiacSign)?.symbol} {profile.zodiacSign || "Not set yet..."}
                                </div>
                            </div>
                            {renderViewField("Date of Birth", profile.dob)}
                            {renderViewField("School", profile.school)}
                            {renderViewField("Blood Group", profile.bloodGroup)}
                            {renderViewField("Home Address", profile.address)}
                        </div>
                        <div className={styles.section}>
                            <h2>My Favorites</h2>
                            <div className={styles.viewField}>
                                <div className={styles.viewLabel}>Favorite Colour</div>
                                <div className={styles.viewValue} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {profile.favColorCode && (
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: profile.favColorCode, border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                                    )}
                                    {profile.favColor || "Not chosen yet"}
                                </div>
                            </div>
                            {renderViewField("Favorite Food", profile.favFood)}
                            {renderViewField("Favorite Place", profile.favPlace)}
                            {renderViewField("Favorite Book", profile.favBook)}
                            {renderViewField("My Hobbies", profile.hobbies)}
                            {renderViewField("My Goals", profile.personalGoals)}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit(onSubmit)}>
                        {message.text && (
                            <div style={{
                                padding: '15px',
                                borderRadius: '16px',
                                marginBottom: '30px',
                                fontSize: '1rem',
                                background: message.type === 'success' ? '#dcfce7' : '#fef2f2',
                                color: message.type === 'success' ? '#166534' : '#991b1b',
                                textAlign: 'center',
                                fontWeight: 600,
                                border: `1px solid ${message.type === 'success' ? '#b9fbc0' : '#fecaca'}`
                            }}>
                                {message.text}
                            </div>
                        )}

                        <div className={styles.grid}>
                            {/* Left Column: Personal Info */}
                            <div className={styles.section}>
                                <h2>Personal Details</h2>
                                <div className={styles.field}>
                                    <label>My Full Name</label>
                                    <input
                                        className={styles.input}
                                        {...register("realName")}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Father's Name</label>
                                    <input
                                        className={styles.input}
                                        {...register("fathersName")}
                                        placeholder="Father's name"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Mother's Name</label>
                                    <input
                                        className={styles.input}
                                        {...register("mothersName")}
                                        placeholder="Mother's name"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Zodiac Sign</label>
                                    <div className={styles.zodiacGrid}>
                                        {ZODIAC_SIGNS.map(z => (
                                            <div 
                                                key={z.name}
                                                className={`${styles.zodiacItem} ${profile.zodiacSign === z.name ? styles.zodiacItemActive : ''}`}
                                                onClick={() => setValue("zodiacSign", z.name)}
                                                title={z.name}
                                            >
                                                <span className={styles.zodiacSymbol}>{z.symbol}</span>
                                                <span className={styles.zodiacName}>{z.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label>Date of Birth</label>
                                    <input
                                        className={styles.input}
                                        type="date"
                                        {...register("dob")}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>My school</label>
                                    <input
                                        className={styles.input}
                                        {...register("school")}
                                        placeholder="School name"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Blood Group</label>
                                    <input
                                        className={styles.input}
                                        {...register("bloodGroup")}
                                        placeholder="e.g. A+"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Home Address</label>
                                    <input
                                        className={styles.input}
                                        {...register("address")}
                                        placeholder="Full address"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Favorites */}
                            <div className={styles.section}>
                                <h2>My Favorites</h2>
                                <div className={styles.field}>
                                    <label>Favorite Colour Name</label>
                                    <input
                                        className={styles.input}
                                        {...register("favColor")}
                                        placeholder="e.g. Sky Blue"
                                    />
                                    <label style={{ marginTop: '15px' }}>Pick your Hue</label>
                                    <div className={styles.colorPalette}>
                                        {PALETTE_COLORS.map(color => (
                                            <div
                                                key={color}
                                                className={`${styles.colorSwatch} ${profile.favColorCode === color ? styles.colorSwatchActive : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setValue("favColorCode", color)}
                                            >
                                                {profile.favColorCode === color && <Check size={14} color="white" style={{ margin: 'auto', display: 'block', marginTop: '6px' }} />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label>Favorite Food</label>
                                    <input
                                        className={styles.input}
                                        {...register("favFood")}
                                        placeholder="Yummy food!"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Favorite Place</label>
                                    <input
                                        className={styles.input}
                                        {...register("favPlace")}
                                        placeholder="Where do you love to go?"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Favorite Book</label>
                                    <input
                                        className={styles.input}
                                        {...register("favBook")}
                                        placeholder="Favorite read?"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>My Hobbies</label>
                                    <input
                                        className={styles.input}
                                        {...register("hobbies")}
                                        placeholder="Drawing? Games?"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>My Goals</label>
                                    <input
                                        className={styles.input}
                                        {...register("personalGoals")}
                                        placeholder="What do you want to be?"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.footer}>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                <button type="submit" className={styles.saveBtn} disabled={loading}>
                                    {loading ? "Save My Journal..." : "Save My Journal"} <Save size={20} />
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
