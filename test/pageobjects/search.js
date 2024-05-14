const { $ } = require('@wdio/globals');
const { $$ } = require('@wdio/globals');
const RunTheSearchStuff = require('./baseSearch.js')

// this test runs ridiculously slow, running the tests individually is probably better.

class Search extends RunTheSearchStuff {
    get srcBtn() {
        return $('[class*="active"] .fa-search');
    }
    get srcInput() {
        return $('[class*="active"] [class="hfe-search-form__input"]');
    }
    get programName() {
        return $$('.elementor-posts-container .elementor-heading-title a[href]')
    }
    chkSrcRes(searchKey) {
        return $$(`//*[contains(text(),"${searchKey}")]`);
    }
    get chkGood() {
        return $('//h1[contains(text(),"Search")]');
    }
    badValue = ['',' ','null','undefined'];

    async searchBadRun() {
        await browser.setWindowSize(1200, 800);
        for(let i = 0; i < this.badValue.length; i++){
            await this.query(this.badValue[i]);
            await browser.keys(['Enter']);
            await this.srcInput.waitForExist({ reverse: true });
            await this.checkForBad(`the search breaks when '${this.badValue[i]}' is entered.`);
        }
    }
    async searchGoodRun() {
        await browser.setWindowSize(1200, 800);
        await this.openUrl('programs/');
        let goodSearchKey = await this.programName[1].getText();
        await this.query(goodSearchKey);
        await browser.keys(['Enter']);
        if(await this.chkSrcRes(goodSearchKey)[1].length < 1){
            throw new Error(`results dont contain any progams with text '${goodSearchKey}'.`);
        }
    }
    async searchBoundRun() {
        await browser.setWindowSize(1200, 800);
        let longValue = "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890";
        for(let i = 0, u = 1;i < u; i++){
            await this.query(longValue);
            if(i > 10){
                throw new Error(`there's probably no limit to what you can put in this field`);
            }
            if(await this.srcInput.getValue() == longValue){
                await browser.keys(['Enter']);
                if(await this.srcBtn.waitForClickable({ timeoutMsg: `the search died after entering ${u}000 characters and went to a weird page.` })){
                    longValue = longValue.concat("1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890");
                    u++;
                }
            }
            else {
                console.log('search field has a character limit in place, this is good.')
            }
        }
    }
}

module.exports = new Search();