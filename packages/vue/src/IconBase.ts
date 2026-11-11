import { defineComponent, h, type SVGAttributes, type PropType, type VNode, type DefineComponent } from 'vue';

export type IconProps = Omit<SVGAttributes, 'color'> & {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
};
export interface IconNode {
  tag: string;
  attrs: Record<string, string>;
  children: IconNode[];
}

function renderNodes(nodes: IconNode[]): VNode[] {
  return nodes.map(node => h(node.tag, node.attrs, renderNodes(node.children)));
}

export type IconComponent = DefineComponent<IconProps>;

export function createIcon(name: string, nodes: IconNode[]): IconComponent {
  const Component = defineComponent({
    name,
    inheritAttrs: false,
    props: {
      size: { type: [Number, String] as PropType<number | string>, default: 24 },
      color: { type: String, default: 'currentColor' },
      strokeWidth: { type: [Number, String] as PropType<number | string>, default: 2 },
      absoluteStrokeWidth: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
      return () => {
        const numericSize = typeof props.size === 'number' ? props.size : Number.parseFloat(props.size);
        const stroke = props.absoluteStrokeWidth && numericSize > 0 ? Number(props.strokeWidth) * 24 / numericSize : props.strokeWidth;
        const labelled = Boolean(attrs['aria-label'] || attrs['aria-labelledby'] || attrs['aria-hidden'] === false || attrs['aria-hidden'] === 'false');
        return h('svg', {
          xmlns: 'http://www.w3.org/2000/svg', width: props.size, height: props.size,
          viewBox: '0 0 24 24', fill: 'none', stroke: props.color, 'stroke-width': stroke,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          role: attrs.role ?? (labelled ? 'img' : undefined),
          'aria-hidden': attrs['aria-hidden'] ?? (labelled ? undefined : true),
          ...attrs,
        }, [...renderNodes(nodes), ...(slots.default?.() ?? [])]);
      };
    },
  });
  return Component as IconComponent;
}
