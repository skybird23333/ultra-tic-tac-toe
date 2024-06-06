export const generateUsername = () => {
    const adjectives = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Grey", "Brown", "Cyan", "Magenta", "Lime", "Maroon", "Navy", "Olive", "Teal", "Silver", "Gold", "Violet", "Indigo", "Azure", "Beige", "Coral", "Crimson", "Fuchsia", "Khaki", "Lavender", "Lemon", "Lilac", "Mint", "Peach", "Plum", "Salmon", "Scarlet", "Turquoise", "Amber", "Aqua", "Ash", "Auburn", "Burgundy", "Cerulean", "Cobalt", "Copper", "Cyan", "Emerald", "Hazel", "Ivory", "Jade", "Jet", "Lemon", "Mauve", "Olive", "Peach", "Pear", "Ruby", "Russet", "Rust", "Sapphire", "Slate", "Tawny", "Topaz", "Wine", "Zinc", "Almond", "Apricot", "Aubergine", "Bisque", "Brick", "Buff", "Butter", "Caramel", "Champagne", "Charcoal", "Chestnut", "Cinnamon", "Citron", "Claret", "Cocoa", "Coffee", "Cream", "Crimson", "Dove", "Ebony", "Flax", "Ginger", "Honey", "Linen", "Mauve", "Mocha", "Moss", "Mustard", "Nutmeg", "Ochre", "Papaya", "Peach", "Pine", "Pistachio", "Pumpkin", "Raspberry", "Rose", "Saffron", "Sandalwood", "Sesame", "Sienna", "Sorrel", "Spice", "Straw", "Tangerine", "Taupe", "Vanilla", "Walnut", "Wheat", "Acidic", "Aged", "Airy", "Alarming", "Ancient", "Angry", "Arctic", "Arid", "Aromatic"]
    const nouns = ["Apple", "Banana", "Cherry", "Grape", "Kiwi", "Lemon", "Lime", "Mango", "Melon", "Orange", "Peach", "Pear", "Pineapple", "Plum", "Strawberry", "Watermelon", "Avocado", "Blackberry", "Blueberry", "Coconut", "Cranberry", "Currant", "Date", "Fig", "Gooseberry", "Grapefruit", "Guava", "Honeydew", "Kumquat", "Lychee", "Nectarine", "Papaya", "Passionfruit", "Persimmon", "Pomegranate", "Raspberry", "Starfruit", "Tangerine", "Ugli", "Apricot", "Cantaloupe", "Cherry", "Clementine", "Damson", "Elderberry", "Feijoa", "Jujube", "Mandarin", "Miracle", "Mulberry", "Olive", "Peach", "Prune", "Quince", "Raisin", "Soursop", "Tamarillo", "Tamarind", "Ugni", "Yuzu", "Acai", "Acerola", "Barberry", "Bilberry", "Boysenberry", "Carambola", "Cloudberry", "Cranberry", "Dragonfruit", "Durian", "Feijoa", "Goji", "Huckleberry", "Jabuticaba", "Juniper", "Kiwano", "Kiwifruit", "Lingonberry", "Loquat", "Mangosteen", "Marionberry", "Nance", "Pepino", "Pitaya", "Salak", "Salal", "Saskatoon", "Soursop", "Tayberry", "Thimbleberry", "Ume", "Yuzu", "Zalzalak", "Ziziphus", "Acerola", "Akebia", "Atemoya", "Babaco", "Bael", "Barbadine", "Bignay", "Bilimbi", "Biriba"]
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`
}

/**
 * Stolen from react example
 * @param squares The grid
 */
export function calculateWinner(squares: string[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    if (squares.every((x) => x)) return "?" //Draw
    return null;
}