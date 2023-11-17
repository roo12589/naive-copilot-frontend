export interface ExportYuhunData {
    ocr_info: {
        version: number
    }
    user_info: {
        user_name: string
        user_id: string
        server_name: string
        time_stamp: number
    }
    equip_drawers: Record<string, string[]>[]
    equip_data: Yuhun[]
}

export interface Yuhun {
    id: string
    born: number
    suit_id: number
    pos: number
    level: number
    quality: number
    base_attr: PartialRecord<YuhunAttr, number>
    rand_attr: PartialRecord<YuhunAttr, number>
    garbage: boolean
    lock: boolean
    weared: boolean
    single_attr: number
}

export interface YuhunPro extends Omit<Yuhun, 'base_attr' | 'rand_attr'>, PartialRecord<YuhunAttr, number> {
    main_attr: YuhunAttr
    /** 四个rand_attr拼接 */
    sub_attrs: string
    suit_name: string
}

type PartialRecord<K extends string | number | symbol, T> = { [P in K]?: T }

type YuhunAttr =
    | 'AttackRate'
    | 'EffectHitRate'
    | 'CritRate'
    | 'Speed'
    | 'DefenseRate'
    | 'Attack'
    | 'Hp'
    | 'Defense'
    | 'EffectResistRate'
    | 'HpRate'
    | 'CritPower'
