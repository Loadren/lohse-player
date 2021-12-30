const { Octokit } = require("@octokit/rest");

class Github {
    constructor(authToken){
        this.octokit = new Octokit({
            auth: authToken,
            userAgent: 'LohsePlayer v1',

            log: {
                debug: () => {},
                info: () => {},
                warn: console.warn,
                error: console.error
            },

            request: {
                agent: undefined,
                fetch: undefined,
                timeout: 0
            }
        });
    }

    async createIssue(title, description, type){
        const dataIssue = await this.octokit.rest.issues.create({
            owner: "Loadren",
            repo: "lohse-player",
            title: title,
            body: description,
            labels: type
        });

        return dataIssue?.data?.html_url;
    }
}

module.exports = Github;