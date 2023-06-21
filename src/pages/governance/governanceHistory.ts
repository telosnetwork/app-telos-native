import axios from 'axios';

const hyperionUrl = 'https://mainnet.telos.net';
const sectionScope = 'tbnoa';

const history = axios.create({
    baseURL: hyperionUrl,
});

export interface GovernanceData {
  [key: string]: string | Section[];
  lastAmended: string;
  amendedBy: string;
  sections: Section[];
}

interface Section {
  name: string;
  number: number;
  hash: string;
  text: string;
}

export const getGovernanceHistory = async (): Promise<
  Array<GovernanceData>
> => {
    const deltas = await history.get(
        `v2/history/get_deltas?code=amend.decide&scope=${sectionScope}&table=sections&limit=5000`
    );

    if (deltas.status !== 200) throw new Error('Non 200 from hyperion');

    if (deltas.data.total.value !== deltas.data.deltas.length)
        throw new Error(
            'Unable to get all deltas in one request with limit set to 5000'
        );

    const amendments = {} as GovernanceData[];
    for (let row of deltas.data.deltas.reverse()) {
        const {
            section_name: name,
            section_number: number,
            content: hash,
            last_amended: lastAmended,
            amended_by: amendedBy,
        } = row.data;

        let amendment;

        // Group by last amended value, assuming that each amendment has all it's updates in a unique timestamp/second
        if (!amendments.hasOwnProperty(lastAmended)) {
            amendment = {
                lastAmended,
                amendedBy,
                sections: [],
            } as GovernanceData;
            amendments[lastAmended] = amendment;
        } else {
            amendment = amendments[lastAmended];
        }

        if (amendment.sections.hasOwnProperty(number))
            throw new Error(
                // eslint-disable-next-line max-len
                'Section modified twice in the same amendment (actually in the same second, but we assume each second will only have one amendment)'
            );

        amendment.sections[number] = {
            name,
            number: parseInt(number),
            hash,
            text: '',
        };
    }

    const orderedAmendments = Object.values(amendments).sort((a, b) => {
        return Date.parse(a.lastAmended) - Date.parse(b.lastAmended);
    });

    orderedAmendments.forEach((amendment) => {
        amendment.sections = Object.values(amendment.sections).sort((a, b) => {
            return a.number - b.number;
        });
    });

    for (let amendment of orderedAmendments) {
        console.log('======================');
        // eslint-disable-next-line max-len
        console.log(
            // eslint-disable-next-line max-len
            `On ${amendment.lastAmended} ${amendment.amendedBy} modified ${amendment.sections.length} sections: `
        );
        for (let section of amendment.sections) {
            if (
            // eslint-disable-next-line max-len
                section.hash === 'QmNSsoUpPY1x9ZQtdGFc1ia9xL3zSnjtUsrxHxpNxdTMx8' // bad hash, prevent script stalling
            ) {
                continue;
            }
            console.log(`${section.number} ${section.name} - ${section.hash}`);
            try {
                const contentData = await getContent(section.hash);
                section.text = contentData;
            } catch (e) {
                console.log(`ERROR fetching content for hash: ${section.hash}`);
            }
        }
    }

    return orderedAmendments;
};

export async function getContent(contentHash: string) {
    const ipfsResponse = await axios.get(
        `https://ipfs.telos.net/ipfs/${contentHash}`
    );
    return ipfsResponse.data;
}
