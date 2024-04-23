export default function abbreviateWord(word, maxLength) {
    return word.length > maxLength ? word.substring(0, maxLength) + '...' : word;
}