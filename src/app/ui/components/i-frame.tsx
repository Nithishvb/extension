//
//  __          __     _____  _   _ _____ _   _  _____
//  \ \        / /\   |  __ \| \ | |_   _| \ | |/ ____|
//   \ \  /\  / /  \  | |__) |  \| | | | |  \| | |  __
//    \ \/  \/ / /\ \ |  _  /| . ` | | | | . ` | | |_ |
//     \  /\  / ____ \| | \ \| |\  |_| |_| |\  | |__| |
//      \/  \/_/    \_\_|  \_\_| \_|_____|_| \_|\_____|
//
// The purpose of this iframe is to wrap content from external sources,
// primarily for use with inscriptions. Iframes are dangerous and we
// need to be very careful with our use of them.
//
// Below, we use the sandbox attribute to limit what they can do, as well as
// disabling any interaction with pointer events and user selection.
import { HTMLAttributes } from 'react';

interface IFrameProps extends HTMLAttributes<HTMLIFrameElement> {
  src: string;
}
export function IFrame({ src, ...props }: IFrameProps) {
  return <iframe loading="lazy" sandbox="allow-scripts" src={src} {...props} />;
}
