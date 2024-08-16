import UserService from "services/UserService";
import InflectWordService from "services/inflectWord/InflectWordService";

export const generateAutoTags = async (properties, user) => {
    if (!properties) return;
    const keys = Object.keys(properties);
    const takeAutoTags = (
        await Promise.all(
            keys.map(async (key) => {
                if (properties[key].data_taken === "auto") {
                    let name;

                    try {
                        name = await UserService.auto_user_info(
                            user.id,
                            properties[key].field_name,
                        );
                    } catch (error) {
                        console.error("An error occurred:", error);
                    }

                    if (!name || (name.name === null && name.nameKZ === null)) {
                        name = [{ name: " ", nameKZ: " " }];
                    } else if (name.nameKZ === null && name.name !== null) {
                        name = [{ name: name.name, nameKZ: " " }];
                    } else if (name.nameKZ !== null && name.name === null) {
                        name = [{ name: " ", nameKZ: name.nameKZ }];
                    }

                    let newValName = "";
                    let newNameKZ = "";
                    if (Array.isArray(name)) {
                        const names = name.map((item) => item.name);
                        newValName = names.join(", ");
                        const namesKZ = name.map((item) => item.nameKZ);
                        newNameKZ = namesKZ.join(", ");
                    }

                    const cases = properties[key].to_tags?.cases;

                    if (
                        properties[key].field_name === "family_member" ||
                        ["name", "surname", "father_name"].includes(properties[key].field_name)
                    ) {
                        return await handleNameFields(key, name, properties, cases);
                    } else if (name) {
                        return {
                            newWord: newValName
                                ? newValName.toLowerCase()
                                : name.name.toLowerCase(),
                            newWordKZ: newNameKZ
                                ? newNameKZ.toLowerCase()
                                : name.nameKZ.toLowerCase(),
                            type: "auto",
                            key,
                        };
                    }
                }
            }),
        )
    ).filter((item) => item !== undefined);

    return takeAutoTags;
};

const handleNameFields = async (key, name, properties, cases) => {
    let withoutKZ = translateToRussian(name.name);
    let newName = "";
    let newNameKZ = "";

    if (name.name && cases) {
        if (cases !== 7) {
            newName = await InflectWordService.inflect(withoutKZ, cases, "ru");
        } else {
            newName = withoutKZ;
        }
        newNameKZ = await InflectWordService.inflect(name.nameKZ, cases, "kz");
    }

    if (
        ["name", "surname", "father_name"].includes(properties[key].field_name) &&
        newName !== undefined &&
        name.name
    ) {
        newName = `${name.name.charAt(0).toUpperCase()}${name.name.slice(1)}${newName.slice(
            withoutKZ.length,
        )}`;
        newNameKZ = `${newNameKZ.charAt(0).toUpperCase()}${newNameKZ.slice(1)}`;
    }

    return {
        key,
        newWord: newName ? newName.toLowerCase() : name.name?.toLowerCase() || " ",
        newWordKZ: newNameKZ ? newNameKZ.toLowerCase() : name.nameKZ?.toLowerCase() || " ",
        capital: true,
        type: "auto",
    };
};

function translateToRussian(text) {
    if (text) {
        let kzText = text.toUpperCase();
        const translationMap = {
            "Қ": "К",
            "Ә": "Э",
            "Ң": "Н",
            "Ғ": "Г",
            "Ұ": "У",
            "Ү": "У",
            "Җ": "Ж",
            "Ө": "О",
            "Һ": "Н",
            "І": "И",
        };

        let result = "";

        for (let i = 0; i < kzText.length; i++) {
            const kzChar = kzText[i];

            if (kzChar in translationMap) {
                result += translationMap[kzChar];
            } else {
                result += kzChar;
            }
        }

        return result.toLowerCase();
    }
}
