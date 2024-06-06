import Ably from 'ably'

export default new class {
    ably?: Ably.Realtime = undefined
    connected = false
    username = this.generateUsername()

    async connect() {
        this.ably = new Ably.Realtime("G2vyGQ.FuwlkA:a6bRypeOh9KTKadzkKixEuHNtp6CwmzK-GoMUgcQH9A")

        if (!this.ably) return
        // Connect to Ably with your API key
        this.ably.connection.once("connected", () => {
            this.registerAblyHandler()
            console.log("[Ably] Connected")
            this.connected = true
        })

        // Handle connection failure
        this.ably.connection.once("failed", () => {
            console.log("[Ably] Connection failed")
        })

        // Handle disconnection
        this.ably.connection.once("closed", () => {
            console.log("[Ably] Connection closed")
            this.connected = false
        })
    }

    generateUsername() {
        const adjectives = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Grey", "Brown", "Cyan", "Magenta", "Lime", "Maroon", "Navy", "Olive", "Teal", "Silver", "Gold", "Violet", "Indigo", "Azure", "Beige", "Coral", "Crimson", "Fuchsia", "Khaki", "Lavender", "Lemon", "Lilac", "Mint", "Peach", "Plum", "Salmon", "Scarlet", "Turquoise", "Amber", "Aqua", "Ash", "Auburn", "Burgundy", "Cerulean", "Cobalt", "Copper", "Cyan", "Emerald", "Hazel", "Ivory", "Jade", "Jet", "Lemon", "Mauve", "Olive", "Peach", "Pear", "Ruby", "Russet", "Rust", "Sapphire", "Slate", "Tawny", "Topaz", "Wine", "Zinc", "Almond", "Apricot", "Aubergine", "Bisque", "Brick", "Buff", "Butter", "Caramel", "Champagne", "Charcoal", "Chestnut", "Cinnamon", "Citron", "Claret", "Cocoa", "Coffee", "Cream", "Crimson", "Dove", "Ebony", "Flax", "Ginger", "Honey", "Linen", "Mauve", "Mocha", "Moss", "Mustard", "Nutmeg", "Ochre", "Papaya", "Peach", "Pine", "Pistachio", "Pumpkin", "Raspberry", "Rose", "Saffron", "Sandalwood", "Sesame", "Sienna", "Sorrel", "Spice", "Straw", "Tangerine", "Taupe", "Vanilla", "Walnut", "Wheat", "Acidic", "Aged", "Airy", "Alarming", "Ancient", "Angry", "Arctic", "Arid", "Aromatic"]
        const nouns = ["Apple", "Banana", "Cherry", "Grape", "Kiwi", "Lemon", "Lime", "Mango", "Melon", "Orange", "Peach", "Pear", "Pineapple", "Plum", "Strawberry", "Watermelon", "Avocado", "Blackberry", "Blueberry", "Coconut", "Cranberry", "Currant", "Date", "Fig", "Gooseberry", "Grapefruit", "Guava", "Honeydew", "Kumquat", "Lychee", "Nectarine", "Papaya", "Passionfruit", "Persimmon", "Pomegranate", "Raspberry", "Starfruit", "Tangerine", "Ugli", "Apricot", "Cantaloupe", "Cherry", "Clementine", "Damson", "Elderberry", "Feijoa", "Jujube", "Mandarin", "Miracle", "Mulberry", "Olive", "Peach", "Prune", "Quince", "Raisin", "Soursop", "Tamarillo", "Tamarind", "Ugni", "Yuzu", "Acai", "Acerola", "Barberry", "Bilberry", "Boysenberry", "Carambola", "Cloudberry", "Cranberry", "Dragonfruit", "Durian", "Feijoa", "Goji", "Huckleberry", "Jabuticaba", "Juniper", "Kiwano", "Kiwifruit", "Lingonberry", "Loquat", "Mangosteen", "Marionberry", "Nance", "Pepino", "Pitaya", "Salak", "Salal", "Saskatoon", "Soursop", "Tayberry", "Thimbleberry", "Ume", "Yuzu", "Zalzalak", "Ziziphus", "Acerola", "Akebia", "Atemoya", "Babaco", "Bael", "Barbadine", "Bignay", "Bilimbi", "Biriba"]
        return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`
    }

    async registerAblyHandler() {
        if (!this.ably) return
        const channel = this.ably.channels.get('main-lobby')
        await channel.subscribe("game-invite", (message) => {
            console.log("[Ably] Received game invite", message.data)
        })
    }

    async getPlayersInLobby() {

    }

    async invitePlayerToGame(playerId: string) {
    }

    async registerGameInviteHandler(callback: (invite: any) => void) {
    }

    async acceptGameInvite(invite: any) {
    }
}