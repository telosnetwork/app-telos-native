export const secondsToHms = (seconds: number): string => {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    if (d > 0) return `${d} ${'days'}`;
    const h = Math.floor(seconds / 3600);
    if (h > 0) return `${h} ${'hours'}`;
    const m = Math.floor((seconds % 3600) / 60);
    if (m > 0) return `${m} ${'minutes'}`;
    const s = Math.floor((seconds % 3600) % 60);
    if (s > 0) return `${s} ${'seconds'}`;
    return '';
};

export const timeAgo = (date: Date): string => {
    // must add '+00:00' to tell Javascript to use GMT time zone
    const dateTime = new Date(`${date}+00:00`);
    const dateTimestamp = dateTime.getTime() / 1000;
    const nowTimestamp = Date.now() / 1000;
    const timeGap = secondsToHms(nowTimestamp - dateTimestamp);
    const timeSyntax = `${timeGap} ${'time_ago'}`;
    return timeSyntax;
};

export const secondsToDhms = (
    inputVar: string | number
): string | undefined => {
    const inputNumber = Number(inputVar);
    const days: number | string = Math.floor(inputNumber / (3600 * 24));
    const hours: number | string = Math.floor(
        (inputNumber % (3600 * 24)) / 3600
    );
    const minutes: number | string = Math.floor(
        ((inputNumber % (3600 * 24)) % 3600) / 60
    );
    const seconds: number | string = Math.floor(
        ((inputNumber % (3600 * 24)) % 3600) % 60
    );

    if (days) return `${days} ${'days'}`;
    if (hours) return `${hours} ${'hours'}`;
    if (minutes) return `${minutes} ${'minutes'}`;
    if (seconds) return `${seconds} ${'seconds'}`;
};

export const secondsToDDHHMMSS = (inputVar: string | number): string => {
    const inputNumber = Number(inputVar) / 1000;
    let days: number | string = Math.floor((inputNumber / 3600) * 24);
    let hours: number | string = Math.floor((inputNumber % (3600 * 24)) / 3600);
    let minutes: number | string = Math.floor(
        (inputNumber - hours * 3600) / 60
    );
    let seconds: number | string = Math.floor(
        inputNumber - hours * 3600 - minutes * 60
    );
    if (days < 1) {
        days = '';
    } else {
        days = days < 10 ? `0${days}:` : `${days}`;
    }
    if (hours < 1) {
        hours = '';
    } else {
        hours = hours < 10 ? `0${hours}:` : `${hours}`;
    }
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${days}:${hours}:${minutes}:${seconds}`;
};

export const ZERO_TIME = '1970-01-01T00:00:00';

export const IS_TIME_PASSED = (time: string) => {
    const newDateString = `${time}Z`;
    const newDate = new Date(newDateString);
    const newTime = newDate.getTime();
    const rightNow = new Date().getTime();
    if (newTime < rightNow) return true;
    return false;
};
