
import { StyleProfile } from "../types";
import { DESIGN_STYLES } from '../constants';

const PROFILE_KEY = 'spruce-style-profile';

export const getProfile = (): StyleProfile => {
    try {
        const profileJson = localStorage.getItem(PROFILE_KEY);
        if (profileJson) {
            return JSON.parse(profileJson);
        }
    } catch (e) {
        console.error("Could not parse style profile from localStorage", e);
    }
    return {};
};

export const recordPreference = (style: string): StyleProfile => {
    // Normalize style name to match one of the constants if possible
    const normalizedStyle = DESIGN_STYLES.find(s => style.toLowerCase().includes(s.toLowerCase())) || style;

    const profile = getProfile();
    profile[normalizedStyle] = (profile[normalizedStyle] || 0) + 1;
    
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
        console.error("Could not save style profile to localStorage", e);
    }
    
    return profile;
};
