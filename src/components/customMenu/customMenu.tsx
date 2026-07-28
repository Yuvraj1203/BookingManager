import { MenuAction, MenuView } from '@react-native-menu/menu';
import { ReactNode } from 'react';

/** dummy data */
// export const menuActions: MenuActionWithHandler[] = [
//   {
//     id: 'add',
//     title: 'Add',
//     titleColor: '#2367A2',
//     image: Platform.select({ ios: 'plus', android: 'ic_menu_add' }),
//     imageColor: '#2367A2',
//     subactions: [
//       {
//         id: 'addBooking',
//         title: 'New Booking',
//         image: Platform.select({
//           ios: 'calendar.badge.plus',
//           android: 'ic_menu_today',
//         }),
//         onPress: () => console.log('Add booking pressed'),
//       },
//       {
//         id: 'addGuest',
//         title: 'New Guest',
//         image: Platform.select({
//           ios: 'person.badge.plus',
//           android: 'ic_menu_add',
//         }),
//         onPress: () => console.log('Add guest pressed'),
//       },
//     ],
//   },
//   {
//     id: 'share',
//     title: 'Share',
//     titleColor: '#46F289',
//     subtitle: 'Share via SNS',
//     image: Platform.select({
//       ios: 'square.and.arrow.up',
//       android: 'ic_menu_share',
//     }),
//     imageColor: '#46F289',
//     onPress: () => console.log('Share pressed'),
//   },
//   {
//     id: 'more',
//     title: 'More',
//     subactions: [
//       {
//         id: 'archive',
//         title: 'Archive',
//         image: Platform.select({
//           ios: 'archivebox',
//           android: 'ic_menu_archive',
//         }),
//         onPress: () => console.log('Archive pressed'),
//       },
//       {
//         id: 'delete',
//         title: 'Delete',
//         attributes: { destructive: true },
//         image: Platform.select({ ios: 'trash', android: 'ic_menu_delete' }),
//         onPress: () => console.log('Delete pressed'),
//       },
//     ],
//   },
// ];

export type MenuActionWithHandler = Omit<MenuAction, 'subactions'> & {
  onPress?: () => void;
  subactions?: MenuActionWithHandler[];
};

type CustomMenuProps = {
  title?: string;
  shouldOpenOnLongPress?: boolean;
  trigger: ReactNode;
  actions: MenuActionWithHandler[];
  onCommonPress?: (id: string) => void;
};

const findAction = (
  list: MenuActionWithHandler[],
  id: string,
): MenuActionWithHandler | undefined => {
  for (const action of list) {
    if (action.id === id) return action;
    const found = action.subactions && findAction(action.subactions, id);
    if (found) return found;
  }
  return undefined;
};

const stripHandlers = (list: MenuActionWithHandler[]): MenuAction[] =>
  list.map(({ onPress: _onPress, subactions, ...action }) => ({
    ...action,
    ...(subactions ? { subactions: stripHandlers(subactions) } : {}),
  }));

export const CustomMenu = ({
  title,
  shouldOpenOnLongPress = false,
  trigger,
  actions,
  ...props
}: CustomMenuProps) => {
  return (
    <MenuView
      title={title}
      actions={stripHandlers(actions)}
      shouldOpenOnLongPress={shouldOpenOnLongPress}
      onPressAction={({ nativeEvent }) => {
        if (props.onCommonPress) {
          props.onCommonPress(nativeEvent.event);
        } else {
          findAction(actions, nativeEvent.event)?.onPress?.();
        }
      }}
    >
      {trigger}
    </MenuView>
  );
};
