import { Drawer, Modal, Pill, TextInput } from "@mantine/core";
import {
    ArrowLeftIcon, CalendarMinusIcon,
    ChevronRightIcon,
    CoinsIcon,
    CreditCardIcon,
    File, GlobeLock,
    HandCoinsIcon,
    HashIcon,
    LandmarkIcon,
    PlusIcon,
    RefreshCcw, Rows2,
    ShieldAlert,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { Button } from "@/components/ui/button.tsx";
import { useRecoilState } from "recoil";
import { accountsState } from "@/states.ts";
import { useState } from "react";
import { DemoChart } from "@/pages/Charts.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TRANSACTIONS_BY_DATE } from "@/lib/useTransactions.tsx";

export function TD() {
  return (
    <>
      <AccountDetails bank={accounts["TD"]} />
    </>
  );
}

export function CO() {
  return (
    <>
      <AccountDetails bank={accounts["RBC"]} />
    </>
  );
}

export const options = ["1M", "3M", "6M", "1Y", "ALL"];

export function TabGroup({
  options,
  className,
}: {
  options: string[];
  className?: string;
}) {
  const [selected, setSelected] = useState(options[0]);
  return (
    <div
      className={
        "flex p-0.5 rounded-xl w-full bg-gray-100 gap-2 " +
        `justify-between border border-gray-800 ${className}`
      }
    >
      {options.map((o) => (
        <Button
          variant={"ghost"}
          key={o}
          className={`rounded-lg border h-8 hover:bg-gray-200
         ${selected === o ? "!bg-white border-gray-800" : "border-gray-100"}`}
          onClick={() => setSelected(o)}
        >
          {o}
        </Button>
      ))}
    </div>
  );
}

export function TabGroup2({
  options,
  className,
  selected,
  setSelected,
}: {
  options: string[];
  className?: string;
  selected: string;
  setSelected: any;
}) {
  return (
    <div className={`flex ${className} border border-gray-700 rounded-lg p-1`}>
      {options.map((o) => (
        <Button
          key={o}
          variant={selected === o ? "default" : "ghost"}
          onClick={() => setSelected(o)}
          className={'h-8'}
        >
          {o}
        </Button>
      ))}
    </div>
  );
}

export function AccountDetails({ bank }: { bank: Bank }) {
  const [open, setOpen] = useState(false);
  const [, setAcc] = useRecoilState(accountsState);
  const navigate = useNavigate();

  console.log(bank);
  const recentTransactions = TRANSACTIONS_BY_DATE[0].transactions.filter(
    ({ account }) => account.includes(bank.name)
  );

  return (
    <>
      <div className="z-50 sticky top-0 bg-white p-5 border-b-[1px] border-b-gray-300 flex flex-col gap-6">
        <div className="flex justify-between items-center w-full">
          <Link to={"/accounts"}>
            <ArrowLeftIcon />
          </Link>
          <h1 className="text-xl font-bold self-center">{bank.name}</h1>
          <img src={"./" + bank.img} className={"w-8 h-8 rounded-full"} />
        </div>
      </div>

      <div className={"flex flex-col gap-5 p-5 mb-2"}>
        <Card>
          <CardHeader>
            <div className={"flex justify-between items-center"}>
              <CardTitle>Net Worth</CardTitle>

              <CardTitle>
                $
                {Object.values(bank.accounts)
                  .reduce((acc, { balance }) => acc + balance, 0)
                  .toFixed(2)}
              </CardTitle>
            </div>
            <CardDescription>{bank.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <DemoChart td={bank.name==="TD"} />
          </CardContent>
          <CardFooter>
            <TabGroup options={options} />
          </CardFooter>
        </Card>

          <Card
              onClick={() => {
                  navigate("/budget");
              }}
              className={"hoverable-card"}
          >
              <CardHeader>
                  <CardTitle>Deadlines</CardTitle>
                  <CardDescription>Payment deadlines</CardDescription>
              </CardHeader>

              <CardContent className={"gap-4 flex flex-col"}>
                  {!bank.accounts.Credit ? <p>No deadlines found.</p> :
                      <Row2
                          name={`In ${Math.ceil(
                              (new Date("2024-08-20").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                          )} days`}
                          description={"Credit card payment"}
                          icon={<CalendarMinusIcon/>}
                          value={"$"+bank.accounts.Credit.balance.toFixed(2)}
                      />
                  }

              </CardContent>
          </Card>

        <Card
          onClick={() => {
            navigate("/transactions");
          }}
          className={"hoverable-card"}
        >
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Recent transactions</CardDescription>
          </CardHeader>

          <CardContent className={"gap-4 flex flex-col"}>
            {recentTransactions.length === 0 && <p>No recent transactions.</p>}
            {recentTransactions.map(
              ({ name, account, category, icon, amount, pending }) => (
                <button
                  key={name}
                  className="text-left flex justify-between items-center gap-2 bg-white w-full"
                  onClick={() => {}}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    {icon}
                  </div>
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-xs">{account}</p>
                    <p className="text-xs text-gray-500">{category}</p>
                  </div>
                  <div className="flex-1 text-right self-start">
                    <p className="font-semibold">-${amount.toFixed(2)}</p>
                    {pending && <Pill>Pending</Pill>}
                  </div>
                </button>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={"flex flex-col gap-4"}>
              <Row
                title={"Institution"}
                value={bank.name}
                icon={<LandmarkIcon size={18} />}
              />
              <Row
                title={"Type"}
                value={"Bank Account"}
                icon={<File size={18} />}
              />
              <Row
                title={"Total Accounts"}
                value={`${Object.values(bank.accounts).length}`}
                icon={<HashIcon size={18} />}
              />
              <Row
                title={"Last Updated"}
                value={"Just Now"}
                icon={<RefreshCcw size={18} />}
              />
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button variant={"destructive"} className={"w-full"}>
                    UNLINK
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Unlink {bank.name}?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently unlink
                      your account!
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className={"flex gap-2"}>
                    <Button
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        setAcc((prev: any) => {
                          const n = { ...prev };
                          delete n[bank.name];
                          return n;
                        });
                        navigate("/accounts");
                      }}
                    >
                      Unlink
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function Row({
  icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: string;
}) {
  return (
    <div className={"flex gap-2 items-center"}>
      {icon}
      <p className={"text-gray-800 text-sm leading-4 "}>{title}</p>
      <p className={"leading-4 ml-auto"}>{value}</p>
    </div>
  );
}
export function ConvinceUser({
                                 title,
                                 opened, open, close, img
                             }: { title: string, opened: boolean, open: any, close: any, img: string }) {
    const navigate = useNavigate()
    const [acc, setAcc]: any = useRecoilState(accountsState);
    const [mOpened, {open: mOpen, close: mClose}] = useDisclosure(false);

    return <Drawer
        position="bottom"
        size={"xl"}
        opened={opened}
        onClose={close}
        title={"TD"}
        className={"f-drawer"}
    >
        <div className={"flex flex-col gap-6 items-center h-full grow"}>
            <img
                src={img}
                className={"object-cover w-24 h-24 rounded-full"}
            />
            <p className={"text-md font-medium"}>You will be securely redirected to {title}'s Portal</p>
            <Card
                onClick={() => {
                    mOpen()
                }}
                className={"w-full flex flex-col p-4 gap-4 hoverable-card"}>
                <div className={"flex gap-3 items-center"}>
                    <div
                        className={
                            "w-10 h-10 shrink-0 bg-gray-100 rounded-full flex justify-center items-center text-gray-900"
                        }
                    >
                        <ShieldAlert size={18}/>
                    </div>
                    <div className={"flex flex-col h-full justify-center gap-1"}>
                        <p className={"leading-4"}>Read-only Access</p>
                        <ol className={"text-gray-500 text-xs leading-4"}>
                            <li>We sync only transactions and cards schedules.</li>
                        </ol>
                    </div>
                </div>
                <div className={"flex gap-3 items-center"}>
                    <div
                        className={
                            "w-10 h-10 shrink-0 bg-gray-100 rounded-full flex justify-center items-center text-gray-900"
                        }
                    >
                        <GlobeLock size={18}/>
                    </div>
                    <div className={"flex flex-col h-full justify-center gap-1"}>
                        <p className={"leading-4"}>Data Privacy</p>
                        <p className={"text-gray-500 text-xs leading-4"}>
                            Our site never collects sensitive account information. We use temporary tokens to read your
                            data.
                        </p>
                    </div>
                </div>
            </Card>
            <div
                className={"flex gap-3 items-center mt-auto text-gray-500 text-sm"}
            >
                <Modal opened={mOpened} onClose={mClose} title="Privacy Policy">
                    <p>
                        We do not store any of your bank account information. We use temporary
                        tokens from your banks to access your account data (read-only). We only access and store your card schedules and transactions locally on device.</p>
                </Modal>
                <p>
                    Read our <span className={"underline cursor-pointer text-pink-700"}
                                   onClick={() => {
                                       mOpen()
                                   }}
                >privacy policy</span>!
                </p>
            </div>
            <Button
                className={"w-full"}
                onClick={() => {
                    close();
                    setAcc({
                        ...acc,
                        [title]: accounts[title],
                    });
                    setTimeout(() => {
                        navigate("/accounts");
                        toast.success(title+" linked!", {
                            description: "You can now access all your "+title+" accounts",
                            duration: 2500,
                            position: "top-center",
                            closeButton: true,
                        });
                    }, 400);
                }}
            >
                CONTINUE
            </Button>
        </div>
    </Drawer>

}

export function AddAccount() {

    const [tOpened, {open: tOpen, close: tClose}] = useDisclosure(false);
    const [cOpened, {open: cOpen, close: cClose}] = useDisclosure(false);
    return (
        <>
            <div className="z-50 sticky top-0 bg-white p-5 border-b-[1px] border-b-gray-300 flex flex-col gap-6">
                <div className="flex gap-4 items-center w-full">
                    <Link to={"/accounts"}>
                        <ArrowLeftIcon/>
                    </Link>
                    <h1 className="text-xl font-bold self-center">Link an account</h1>
                </div>
            </div>
            <div className={"grid grid-cols-2 gap-5 p-5"}>
                <TextInput
                    placeholder={"Search your institution"}
                    className={"col-span-2"}
                ></TextInput>
                <Card
                    className={"aspect-square flex justify-center items-center m-2 hoverable-card"}
                    onClick={tOpen}
                >
                    <img src={"td.png"} className={"object-cover "}/>
                </Card>
                <Card
                    className={"aspect-square flex justify-center items-center m-2 hoverable-card"}
                    onClick={cOpen}
                >
                    <img src={"co.jpg"} className={"object-cover "}/>
                </Card>
            </div>

            <ConvinceUser title={"TD"} opened={tOpened} open={tOpen} close={tClose} img={"td.png"}/>
            <ConvinceUser title={"RBC"} opened={cOpened} open={cOpen} close={cClose} img={"co.jpg"}/>
        </>
    );
}

export default function Accounts() {
  const [acc]: any = useRecoilState(accountsState);
  const navigate = useNavigate();
  return (
    <>
      <div className="z-50 sticky top-0 bg-white p-5 border-b-[1px] border-b-gray-300 flex flex-col gap-6">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl font-bold">Accounts</h1>
          <Link to={"/accounts-add"}>
            <Button variant={"secondary"} className={"flex gap-2"}>
              <PlusIcon /> Add Account
            </Button>
          </Link>
        </div>
      </div>
      <div className={"flex flex-col gap-5 p-5"}>
        {Object.values(acc).length === 0 ? (
          <Card
            className={"hoverable-card"}
            onClick={() => {
              navigate("/accounts-add");
            }}
          >
            <CardHeader>
              <CardTitle>You don't have any accounts yet</CardTitle>
              <CardDescription>
                Link your bank accounts to get started!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className={"w-full"}>Add an account</Button>
            </CardContent>
          </Card>
        ) : (
          Object.values(acc).map((a: any) => <BankCard key={a.name} bank={a} />)
        )}
      </div>
    </>
  );
}

const accounts = {
  TD: {
    name: "TD",
    accounts: {
      Chequing: {
        balance: 900,
        account: 83472,
        description: "Student Chequing",
        name: "Chequing",
        icon: <CoinsIcon size={18} />,
      },
      Savings: {
        balance: 10000,
        account: 83471,
        description: "Everyday Savings",
        name: "Savings",
        icon: <HandCoinsIcon size={18} />,
      },
      Credit: {
        balance: -20,
        description: "Visa",
        account: 81236,
        name: "Credit",
        icon: <CreditCardIcon size={18} />,
      },
    },
    color: {
      bg: "bg-green-100",
      text: "text-green-900",
    },
    to: "td",
    img: "td.png",
  },
  "RBC": {
    img: "co.jpg",
    name: "RBC",
    accounts: {
      Chequing: {
        balance: 1000,
        account: 83472,
        description: "Regular Chequing",
        name: "Chequing",
        icon: <CoinsIcon size={18} />,
      },
      Savings: {
        balance: 281,
        account: 83471,
        description: "Everyday Savings",
        name: "Savings",
        icon: <HandCoinsIcon size={18} />,
      },
    },
    to: "rbc",
    color: {
      bg: "bg-blue-100",
      text: "text-blue-900",
    },
  },
};

export interface Bank {
  color: {
    bg: string;
    text: string;
  };
  name: string;
  img: string;
  to: string;
  accounts: {
    [key: string]: Account;
  };
}

export interface Account {
  name: string;
  balance: number;
  account: number;
  description: string;
  icon: any;
}

function BankCard({ bank }: { bank: Bank }) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => {
        navigate(bank.to);
      }}
      className={"hoverable-card"}
    >
      <CardHeader>
        <div className={"flex justify-between items-center"}>
          <div className={"flex gap-4 items-center"}>
            <img src={bank.img} className={"w-12 h-12 rounded-full"} />
            <div className={"flex flex-col h-full justify-center gap-1"}>
              <CardTitle>{bank.name}</CardTitle>
              <CardDescription>
                {Object.values(bank.accounts).length} accounts
              </CardDescription>
            </div>
          </div>
          <ChevronRightIcon />
        </div>
      </CardHeader>
      <CardContent>
        <div className={"flex flex-col gap-4"}>
          {Object.values(bank.accounts).map((a) => (
            <AccountRow key={a.description} a={a} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AccountRow({ a }: { a: Account }) {
  return (
    <Row2
      name={a.name}
      description={a.description}
      icon={a.icon}
      value={`${a.balance < 0 ? "-" : ""}$${Math.abs(a.balance).toFixed(2)}`}
    />
  );
}

export function Row2({
  icon,
  name,
  description,
  value,
  onClick,
  className,
}: {
  icon: any;
  name: string;
  description: string;
  onClick?: any;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-between items-center ${className}`}
      onClick={onClick}
    >
      <div className={"flex gap-4 justify-center items-center"}>
        <div
          className={
            "w-10 h-10 bg-gray-100 rounded-full flex justify-center items-center text-gray-900"
          }
        >
          {icon}
        </div>
        <div className={"flex flex-col h-full justify-center gap-1"}>
          <p className={"leading-4 font-medium"}>{name}</p>
          <p className={"text-gray-500 text-xs leading-4"}>{description}</p>
        </div>
      </div>
      <div className={"flex gap-2 self-start"}>
        <p className={"text-lg"}>{value}</p>
      </div>
    </div>
  );
}
