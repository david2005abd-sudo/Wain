import React from 'react';
import { Text, TextProps, Pressable, View, StyleSheet, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { useApp } from '../lib/store';
export function T({ style, weight = 'regular', children, ...props }: TextProps & { weight?: 'regular' | 'medium' | 'bold' | 'extra' }) {
 const { colors } = useApp();
 return <Text {...props} style={[{ fontFamily: ({ regular: 'Arabic', medium: 'ArabicMedium', bold: 'ArabicBold', extra: 'ArabicExtra' })[weight], fontSize: 15, color: colors.ink, textAlign: 'right', writingDirection: 'rtl' }, style]}>{children}</Text>;
}
export const Icon = ({ name, size = 21, color = '#263844' }: { name: string; size?: number; color?: string }) => <Ionicons name={name as any} size={size} color={color} />;
export function IconButton({ name, onPress, size = 22, color, style, label }: { name: string; onPress: () => void; size?: number; color?: string; style?: StyleProp<ViewStyle>; label?: string }) {
 const { colors } = useApp();
 return <Pressable accessibilityRole="button" accessibilityLabel={label || name} onPress={onPress} style={({ pressed, hovered }: any) => [{ width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: hovered ? colors.soft : 'transparent', opacity: pressed ? .6 : 1 }, style]}><Icon name={name} size={size} color={color || colors.ink} /></Pressable>;
}
export function Button({ title, icon, onPress, secondary, loading, style, disabled }: { title: string; icon?: string; onPress: () => void; secondary?: boolean; loading?: boolean; style?: StyleProp<ViewStyle>; disabled?: boolean }) {
 const { colors } = useApp();
 return <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={loading || disabled} onPress={onPress} style={({ pressed, hovered }: any) => [{ backgroundColor: secondary ? colors.soft : colors.accent, minHeight: 50, borderRadius: 14, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 9, paddingHorizontal: 17, opacity: disabled ? .45 : pressed ? .75 : 1, transform: [{ scale: pressed ? .98 : 1 }], ...(hovered && !secondary ? { backgroundColor: '#1EACBF' } : {}) }, style]}>{loading ? <ActivityIndicator color={colors.ink} /> : <>{icon && <Icon name={icon} color={colors.ink} size={20} />}<T weight="bold" style={{ fontSize: 15 }}>{title}</T></>}</Pressable>;
}
export function Badge({ title, color = '#69AA91', bg = '#EBF7F0', dot = true }: { title: string; color?: string; bg?: string; dot?: boolean }) {
 return <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6, backgroundColor: bg, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7 }}>{dot && <View style={{ width: 5, height: 5, borderRadius: 4, backgroundColor: color }} />}<T weight="medium" style={{ color, fontSize: 11 }}>{title}</T></View>;
}
export function Mascot({ size = 65, happy = true }: { size?: number; happy?: boolean }) {
 return <Svg width={size} height={size} viewBox="0 0 90 90"><Ellipse cx="43" cy="81" rx="26" ry="4" fill="#B6DFE3" opacity=".5" /><Path d="M70 30C70 12 54 8 42 11C24 13 14 24 16 42C17 54 27 62 39 64L45 76L53 62C68 58 74 45 70 30Z" fill="#51C8DA" stroke="#263844" strokeWidth="2.3" strokeLinejoin="round" /><Path d="M30 16C19 25 18 35 21 43" stroke="#B9F0F5" strokeWidth="3.5" fill="none" strokeLinecap="round" /><Ellipse cx="34" cy="36" rx="3" ry="4" fill="#263844" /><Ellipse cx="55" cy="34" rx="3" ry="4" fill="#263844" /><Path d={happy ? 'M37 46Q46 54 54 44' : 'M38 47L52 46'} stroke="#263844" strokeWidth="2.8" fill="none" strokeLinecap="round" /><Circle cx="27" cy="44" r="4" fill="#EAFBFA" opacity=".6" /><Path d="M18 51L8 55M68 48L78 43" stroke="#263844" strokeWidth="2.8" strokeLinecap="round" /></Svg>;
}
export function Empty({ title, description, icon = 'map-outline' }: { title: string; description: string; icon?: string }) {
 const { colors } = useApp();
 return <View style={{ alignItems: 'center', paddingVertical: 45, paddingHorizontal: 25, gap: 12 }}><View style={{ padding: 22, backgroundColor: colors.accentSoft, borderRadius: 28 }}><Icon name={icon} size={38} color={colors.accent} /></View><T weight="bold" style={{ fontSize: 20, textAlign: 'center' }}>{title}</T><T style={{ color: colors.muted, textAlign: 'center', lineHeight: 23 }}>{description}</T></View>;
}
export const ui = StyleSheet.create({
 row: { flexDirection: 'row-reverse', alignItems: 'center' },
 between: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
 shadow: { shadowColor: '#293C4B', shadowOffset: { width: 0, height: 5 }, shadowOpacity: .07, shadowRadius: 16, elevation: 5 },
 input: { fontFamily: 'Arabic', fontSize: 15, textAlign: 'right', paddingHorizontal: 15, paddingVertical: 13, borderRadius: 13, minHeight: 48 },
});
