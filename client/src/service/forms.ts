
export const onSubmit = (callback: () => void) => {
    return () => callback();
};