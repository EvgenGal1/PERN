export interface KeyCombination {
  keys: string[];
  type: 'sequence' | 'simultaneous' | 'touchpad';
}

export interface FormattedCommand extends KeyCombination {
  name?: string;
}
