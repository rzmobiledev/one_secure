############################################################
#   Forked from :                                          #
#   https://github.com/Nakul08/MailRecords                 #
#   and modified by rizal                                  #
############################################################

import dns.resolver
import re
import csv
import argparse


class MailRecord:

    def __init__(self):
        self.__result = {"MX": [], "DMARC": "", "DKIM": "", "SPF": ""}
        self.__dkim_sw = 1
        self.__file_name = None

    def get_filename(self):
        return self.__file_name

    def set_filename(self, val: str):
        self.__file_name = val

    def mx(self, domain: str):
        self.__dkim_sw = 1
        lt = []
        d = domain
        try:
            answers = dns.resolver.resolve(d, 'MX')
            print("[-] MX Record :", end=" ")
            for i in answers:
                tmp = str(i)
                tmp = tmp.split(" ")[1]
                print('"{0}"'.format(tmp[:-1]), end=" ")
                lt.append(tmp)
                self.__result["MX"] = lt
            print()
        except Exception:
            print("[!] MX Server does not exist")
            self.__result["MX"] = "None"
            self.__dkim_sw = 0

    def dmarc(self, domain: str):
        d = domain
        pat = re.compile(r'^\"v=DMARC\w*')
        try:
            answers = dns.resolver.resolve("_dmarc."+d, 'TXT')
            for i in answers:
                if (len(pat.findall(str(i))) >= 1):
                    print("[-] DMARC Record :", end=" ")
                    print(str(i))
                    self.__result["DMARC"] = str(i)
        except Exception:
            print("\n[!] DMARC Record Not Implemented!")
            self.__result["DMARC"] = "None"

    def dkim(self, domain):
        if (self.__dkim_sw == 1):
            d = domain
            # Selector list taken from online github scripts
            s = ["selector1", "selector2", "mailgun", "dkim", "default", "google", "zix", "google", "k1", "mxvault", "everlytickey1", 'mail', 'class', 'smtpapi', 'dkim', 'bfi', 'spop', 'spop1024', 'beta', 'domk', 'dk', 'ei', 'smtpout', 'sm', 'authsmtp', 'alpha', 'mesmtp', 'cm', 'prod', 'pm', 'gamma', 'dkrnt', 'dkimrnt', 'private', 'gmmailerd', 'pmta', 'x', 'selector', 'qcdkim', 'postfix', 'mikd', 'main', 'm', 'dk20050327', 'delta', 'yibm', 'wesmail', 'test', 'stigmate', 'squaremail', 'sitemail', 'sasl', 'sailthru', 'responsys', 'publickey', 'proddkim', 'mail-in', 'key', 'ED-DKIM', 'ebmailerd', 'Corporate',
                 'care', '0xdeadbeef', 'yousendit', 'www', 'tilprivate', 'testdk', 'snowcrash', 'smtpcomcustomers', 'smtpauth', 'smtp', 'sl', 'sharedpool', 'ses', 'server', 'scooby', 'scarlet', 'safe', 's', 'pvt', 'primus', 'primary', 'postfix.private', 'outbound', 'originating', 'one', 'neomailout', 'mx', 'msa', 'monkey', 'mkt', 'mimi', 'mdaemon', 'mailrelay', 'mailjet', 'mail-dkim', 'mailo', 'mandrill', 'lists', 'iweb', 'iport', 'id', 'hubris', 'googleapps', 'global', 'gears', 'exim4u', 'exim', 'et', 'dyn', 'duh', 'dksel', 'dkimmail', 'corp', 'centralsmtp', 'ca', 'bfi', 'auth', 'allselector', 'zendesk1']
            ans = 1
            i = 0
            print('DKIM check is running....')
            while ans <= 1 and i <= len(s):
                try:

                    answers = dns.resolver.resolve(s[i]+"._domainkey."+d, "TXT")
                    for data in answers:
                        print("\n\n[-] DKIM Signature Verified using selector " + s[i])
                        print("[-] DKIM Value: ", end=" ")
                        print(str(data))
                        self.__result["DKIM"] = str(data)
                        ans = 2
                        i = i+1
                except Exception:
                    i = i+1
                    # print("Failed DKIM for selector : "+s[i])
            if (ans == 1):
                print("\n[!] Cannot verify DKIM Record using available selectors")
                self.__result["DKIM"] = "Unverified"
        else:
            self.__result["DKIM"] = "Not Required"
            print("\n[-] DKIM not required!!")

    def spf(self, domain):
        d = domain
        pat = re.compile(r'^\"v=spf1\w*')
        try:
            answers = dns.resolver.resolve(d, 'TXT')
            print("\n[-] SPF Record :", end=" ")
            for i in answers:
                if (len(pat.findall(str(i))) >= 1):
                    print(str(i), end=" ")
                    self.__result["SPF"] = str(i)
            print()
        except Exception:
            print("[!] No SPF policy exists")
            self.__result["SPF"] = "None"

    def write_file(self, test_domain):
        f = open(self.__file_name, "a", newline='')
        wr = csv.writer(f)
        wr.writerow([test_domain, self.__result["MX"], self.__result["SPF"], self.__result["DKIM"], self.__result["DMARC"]])
        f.close()

    def allcheck(self, d, f):
        print("\n\n[-] Domain: "+d)
        self.mx(d)
        self.dmarc(d)
        self.spf(d)
        self.dkim(d)
        print("")
        print("-"*120)
        if (f == 1):
            self.write_file(d)

    def mk_file(self):
        f = open(self.__file_name, "w", newline='')
        wr = csv.writer(f)
        wr.writerow(["Domain", "MX", "SPF", "DKIM", "DMARC"])
        f.close()


if __name__ == "__main__":

    print()
    parser = argparse.ArgumentParser(description="Program to check for MX | SPF | DMARC and DKIM records")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-d", help="Single domain value(domain.tld)")
    group.add_argument("-D", help="Line separated domain file")
    parser.add_argument("-o", help="Output file", required=False)
    args = parser.parse_args()

    mail_s = MailRecord()
    mail_s.set_filename(args.o)

    if (args.D is not None):
        f = open(args.D, "r")  # path to Domain.txt File
        domains = f.read().splitlines()
        if (args.o is not None):
            mail_s.mk_file()
            for i in domains:
                mail_s.allcheck(i, 1)
            print("\n\n[-] File written successfully!!\n")
        else:
            for i in domains:
                mail_s.allcheck(i, 0)
    else:
        if (args.o is not None):
            mail_s.mk_file()
            mail_s.allcheck(args.d, 1)
            print("\n\n[-] File written successfully!!\n")
        else:
            mail_s.allcheck(args.d, 0)
