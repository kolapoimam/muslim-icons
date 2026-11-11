import { Mosque as VueMosque, type IconProps } from '@muslim-icons/vue';
import { Mosque as SvgMosque, catalog } from '@muslim-icons/svg';
const props: IconProps = { size: 32, color: 'green', strokeWidth: 1.5 };
const raw: string = SvgMosque;
void [VueMosque, props, raw, catalog];
