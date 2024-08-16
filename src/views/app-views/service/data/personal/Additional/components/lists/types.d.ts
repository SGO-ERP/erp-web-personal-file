export type ListModalProps = {
    source?: 'added' | 'edited' | 'get';
    setModalState: (state: { open: boolean; link: string }) => void;
};
