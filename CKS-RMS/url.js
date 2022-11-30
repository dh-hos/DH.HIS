var gettoken_sd = 'http://demosign.easyca.vn:8080/api/authenticate';
var getchuky_sd = 'http://demosign.easyca.vn:8080/api/certificate/getImage';
var kyso_sd = 'http://demosign.easyca.vn:8080/api/sign/pdf';
var gettoken_vt = "https://remotesigning.viettel.vn/adss/service/ras/v1/login";
var getCredentials_list_vt = "https://remotesigning.viettel.vn/adss/service/ras/csc/v1/credentials/list";
var getCredentials_info_vt = "https://remotesigning.viettel.vn/adss/service/ras/csc/v1/credentials/info";
var getSAD_vt = "https://remotesigning.viettel.vn/adss/service/ras/csc/v1/credentials/authorize";
var sighhash_vt = "https://remotesigning.viettel.vn/adss/service/ras/csc/v1/signatures/signHash";

module.exports = {
    gettoken_sd, 
    getchuky_sd,
    kyso_sd,
    gettoken_vt,
    getCredentials_list_vt,
    getCredentials_info_vt,
    getSAD_vt,
    sighhash_vt
} 