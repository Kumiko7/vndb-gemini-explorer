export interface ChatPart {
    text?: string;
    inlineData?: {
        mimeType: string;
        data: string; // base64 encoded string
    };
    toolCall?: any;
    toolResponse?: any;
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: ChatPart[];
    toolLogs?: string[];
}

export interface VnData {
    type: 'vn';
    id: string;
    title: string;
    description?: string;
    image?: {
        id: string;
        url: string;
    };
    rating?: number;
    released?: string;
}

export interface CharacterData {
    type: 'character';
    id: string;
    name: string;
    description?: string;
    image?: {
        id: string;
        url: string;
    };
    vns?: {
        id: string;
        title: string;
        role: string;
    }[];
}

export interface ReleaseData {
    type: 'release';
    id: string;
    title: string;
    released?: string;
    platforms?: string[];
    vns?: {
        id:string;
        title: string;
    }[];
}

export interface ProducerData {
    type: 'producer';
    id: string;
    name: string;
    description?: string;
    lang?: string;
    producerType?: 'co' | 'in' | 'ng'; // Renamed 'type' to avoid conflict
}

export interface StaffData {
    type: 'staff';
    id: string;
    name: string;
    gender?: 'm' | 'f';
    lang?: string;
    description?: string;
}

export interface TagData {
    type: 'tag';
    id: string;
    name: string;
    description?: string;
    category?: 'cont' | 'ero' | 'tech';
    vn_count?: number;
}

export interface TraitData {
    type: 'trait';
    id: string;
    name: string;
    description?: string;
    group_name?: string;
    char_count?: number;
}

export interface QuoteData {
    type: 'quote';
    id: string;
    quote: string;
    score?: number;
    vn?: {
        id: string;
        title: string;
    };
    character?: {
        id: string;
        name: string;
    };
}


export type SidebarItem = VnData | CharacterData | ReleaseData | ProducerData | StaffData | TagData | TraitData | QuoteData;
