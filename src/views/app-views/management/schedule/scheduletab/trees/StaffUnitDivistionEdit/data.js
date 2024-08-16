import { ExclamationCircleOutlined } from '@ant-design/icons';

export const modalIcon = ExclamationCircleOutlined;
export const modalInfo = {
    kk: {
        title: 'Сіз жоюды қалайтыныңызға сенімдісіз бе?',
        icon: modalIcon,
        content: 'Бұл жазба тізімнен және дерекқордан толығымен жойылады',
        okText: 'Ия',
        cancelText: 'Жоқ',
    },
    ru: {
        title: 'Вы уверены, что хотите выполнить удаление?',
        icon: modalIcon,
        content: 'Эта запись будет полностью удалена из списка и базы данных',
        okText: 'Да',
        cancelText: 'Нет',
    },
};
