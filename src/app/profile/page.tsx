"use client";

import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useAuth } from "@frontend/context/AuthContext";
import Header from "@frontend/components/Navigation/Header";
import { Button } from "@frontend/components/Common/Button";
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

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const ProfileSheet = styled.div`
  background: #fff;
  border-radius: var(--radius-lg, 24px);
  padding: 50px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.05);
  position: relative;
  border: 1px solid #f1f5f9;
  min-height: 800px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50px;
    bottom: 0;
    width: 2px;
    background: rgba(220, 38, 38, 0.1);
    box-shadow: 4px 0 0 rgba(220, 38, 38, 0.1);
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
    &::before { display: none; }
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-left: 40px;
  margin-top: 60px;

  @media (max-width: 768px) {
    padding-left: 0;
    flex-direction: column-reverse;
    gap: 20px;
    align-items: center;
    text-align: center;
  }
`;

const TitleSection = styled.div`
  h1 {
    font-size: 2.8rem;
    color: var(--primary);
    margin-bottom: 5px;
  }
  p {
    font-size: 1.1rem;
    color: #64748b;
    font-weight: 500;
  }
`;

const EditToggle = styled.button`
  position: absolute;
  top: 25px;
  right: 35px;
  background: white;
  border: 2px solid #e2e8f0;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  z-index: 10;

  &:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    position: static;
    margin: 0 auto 30px;
    width: fit-content;
  }
`;

const PhotoFrame = styled.div`
  width: 130px;
  height: 160px;
  border: 2px dashed #cbd5e1;
  border-radius: var(--radius-sm, 12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.8rem;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: var(--primary);
    background: #f1f5f9;
  }
`;

const ViewSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  padding-left: 40px;

  > * { flex: 1 1 calc(50% - 25px); }

  @media (max-width: 768px) {
    padding-left: 0;
    > * { flex: 1 1 100%; }
  }
`;

const ViewField = styled.div`
  margin-bottom: 25px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;

  .label {
    font-size: 0.75rem;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }

  .value {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1e293b;
    font-family: 'Quicksand', sans-serif;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  padding-left: 40px;

  > * { flex: 1 1 calc(50% - 25px); }

  @media (max-width: 768px) {
    padding-left: 0;
    > * { flex: 1 1 100%; }
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  h2 {
    font-family: 'Fredoka', sans-serif;
    font-size: 1.5rem;
    color: #1e293b;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input {
    border: none;
    border-bottom: 1px solid #e2e8f0;
    padding: 8px 0;
    font-size: 1.05rem;
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    color: #1e293b;
    background: transparent;
    width: 100%;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-bottom-color: var(--primary);
    }
    &::placeholder {
      color: #94a3b8;
      opacity: 0.5;
      font-weight: 500;
    }
  }
`;

const ZodiacGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

const ZodiacItem = styled.div<{ $active?: boolean }>`
  flex: 1 1 calc(25% - 6px);
  min-width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? 'var(--primary)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'inherit')};
  border: 1px solid ${({ $active }) => ($active ? 'var(--primary)' : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : '0 2px 4px rgba(0,0,0,0.02)')};

  &:hover {
    transform: translateY(-2px);
    ${({ $active }) => !$active && `
      background: #fff;
      border-color: var(--primary-glow, rgba(236,72,153,0.3));
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    `}
  }

  .symbol {
    font-size: 1.4rem;
    margin-bottom: 2px;
  }
  .name {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: ${({ $active }) => ($active ? 0.9 : 1)};
  }

  @media (max-width: 768px) {
    flex: 1 1 calc(33.333% - 6px);
  }
`;

const ColorPalette = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

const ColorSwatch = styled.div<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  
  ${({ $active }) => $active && `
    transform: scale(1.2);
    border-color: #1e293b;
    box-shadow: 0 0 0 3px var(--primary-glow, rgba(236,72,153,0.3));
  `}

  &:hover {
    transform: scale(1.2);
    box-shadow: 0 6px 15px rgba(0,0,0,0.15);
  }
`;

const Footer = styled.div`
  margin-top: 60px;
  padding-top: 40px;
  border-top: 2px dashed #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
`;

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
        <ViewField>
            <div className="label">{label}</div>
            <div className="value">{value || "Not set yet..."}</div>
        </ViewField>
    );

    return (
        <Container>
            <Header />

            <ProfileSheet className="animate-fade-in">
                <EditToggle
                    onClick={() => setIsEditing(!isEditing)}
                    type="button"
                >
                    {isEditing ? <><X size={18} /> Cancel</> : <><Edit3 size={18} /> Edit Profile</>}
                </EditToggle>

                <HeaderSection>
                    <TitleSection>
                        <h1>All About Me! <Sparkles size={32} style={{ color: '#facc15', display: 'inline', verticalAlign: 'middle' }} /></h1>
                        <p>My Personal Journal & Diary Records</p>
                    </TitleSection>
                    <PhotoFrame onClick={() => isEditing && fileInputRef.current?.click()}>
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
                    </PhotoFrame>
                </HeaderSection>

                {fetching ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                        <Star size={32} className="animate-spin" style={{ margin: '0 auto 10px' }} />
                        <p>Opening your journal...</p>
                    </div>
                ) : !isEditing ? (
                    <ViewSection>
                        <Section>
                            <h2>Personal Details</h2>
                            {renderViewField("My Full Name", profile.realName)}
                            {renderViewField("Father's Name", profile.fathersName)}
                            {renderViewField("Mother's Name", profile.mothersName)}
                            <ViewField>
                                <div className="label">Zodiac Sign</div>
                                <div className="value">
                                    {ZODIAC_SIGNS.find(z => z.name === profile.zodiacSign)?.symbol} {profile.zodiacSign || "Not set yet..."}
                                </div>
                            </ViewField>
                            {renderViewField("Date of Birth", profile.dob)}
                            {renderViewField("School", profile.school)}
                            {renderViewField("Blood Group", profile.bloodGroup)}
                            {renderViewField("Home Address", profile.address)}
                        </Section>
                        <Section>
                            <h2>My Favorites</h2>
                            <ViewField>
                                <div className="label">Favorite Colour</div>
                                <div className="value" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {profile.favColorCode && (
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: profile.favColorCode, border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                                    )}
                                    {profile.favColor || "Not chosen yet"}
                                </div>
                            </ViewField>
                            {renderViewField("Favorite Food", profile.favFood)}
                            {renderViewField("Favorite Place", profile.favPlace)}
                            {renderViewField("Favorite Book", profile.favBook)}
                            {renderViewField("My Hobbies", profile.hobbies)}
                            {renderViewField("My Goals", profile.personalGoals)}
                        </Section>
                    </ViewSection>
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

                        <Grid>
                            {/* Left Column: Personal Info */}
                            <Section>
                                <h2>Personal Details</h2>
                                <Field>
                                    <label>My Full Name</label>
                                    <input {...register("realName")} placeholder="Enter your full name" />
                                </Field>
                                <Field>
                                    <label>Father's Name</label>
                                    <input {...register("fathersName")} placeholder="Father's name" />
                                </Field>
                                <Field>
                                    <label>Mother's Name</label>
                                    <input {...register("mothersName")} placeholder="Mother's name" />
                                </Field>
                                <Field>
                                    <label>Zodiac Sign</label>
                                    <ZodiacGrid>
                                        {ZODIAC_SIGNS.map(z => (
                                            <ZodiacItem 
                                                key={z.name}
                                                $active={profile.zodiacSign === z.name}
                                                onClick={() => setValue("zodiacSign", z.name)}
                                                title={z.name}
                                            >
                                                <span className="symbol">{z.symbol}</span>
                                                <span className="name">{z.name}</span>
                                            </ZodiacItem>
                                        ))}
                                    </ZodiacGrid>
                                </Field>
                                <Field>
                                    <label>Date of Birth</label>
                                    <input type="date" {...register("dob")} />
                                </Field>
                                <Field>
                                    <label>My school</label>
                                    <input {...register("school")} placeholder="School name" />
                                </Field>
                                <Field>
                                    <label>Blood Group</label>
                                    <input {...register("bloodGroup")} placeholder="e.g. A+" />
                                </Field>
                                <Field>
                                    <label>Home Address</label>
                                    <input {...register("address")} placeholder="Full address" />
                                </Field>
                            </Section>

                            {/* Right Column: Favorites */}
                            <Section>
                                <h2>My Favorites</h2>
                                <Field>
                                    <label>Favorite Colour Name</label>
                                    <input {...register("favColor")} placeholder="e.g. Sky Blue" />
                                    <label style={{ marginTop: '15px' }}>Pick your Hue</label>
                                    <ColorPalette>
                                        {PALETTE_COLORS.map(color => (
                                            <ColorSwatch
                                                key={color}
                                                $active={profile.favColorCode === color}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setValue("favColorCode", color)}
                                            >
                                                {profile.favColorCode === color && <Check size={14} color="white" style={{ margin: 'auto', display: 'block', marginTop: '6px' }} />}
                                            </ColorSwatch>
                                        ))}
                                    </ColorPalette>
                                </Field>
                                <Field>
                                    <label>Favorite Food</label>
                                    <input {...register("favFood")} placeholder="Yummy food!" />
                                </Field>
                                <Field>
                                    <label>Favorite Place</label>
                                    <input {...register("favPlace")} placeholder="Where do you love to go?" />
                                </Field>
                                <Field>
                                    <label>Favorite Book</label>
                                    <input {...register("favBook")} placeholder="Favorite read?" />
                                </Field>
                                <Field>
                                    <label>My Hobbies</label>
                                    <input {...register("hobbies")} placeholder="Drawing? Games?" />
                                </Field>
                                <Field>
                                    <label>My Goals</label>
                                    <input {...register("personalGoals")} placeholder="What do you want to be?" />
                                </Field>
                            </Section>
                        </Grid>

                        <Footer>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                <Button type="submit" size="large" disabled={loading}>
                                    {loading ? "Save My Journal..." : "Save My Journal"} <Save size={20} />
                                </Button>
                            </div>
                        </Footer>
                    </form>
                )}
            </ProfileSheet>
        </Container>
    );
}
