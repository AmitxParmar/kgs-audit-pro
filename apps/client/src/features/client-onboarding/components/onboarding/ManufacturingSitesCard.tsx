import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { SUPPORT_FUNCTIONS } from "../../utils/constants";
import type { ManufacturingSiteFormEntry } from "../../utils/types";

interface Props {
  manufacturingSites: ManufacturingSiteFormEntry[];
  onUpdateSite: (index: number, key: string, value: string) => void;
  onAddSite: () => void;
  onRemoveSite: (index: number) => void;
  onAddRemote: (mfgIndex: number) => void;
  onUpdateRemote: (mfgIndex: number, remoteIndex: number, key: string, value: string) => void;
  onRemoveRemote: (mfgIndex: number, remoteIndex: number) => void;
  onToggleRemoteFunction: (mfgIndex: number, remoteIndex: number, func: string) => void;
}

export function ManufacturingSitesCard({
  manufacturingSites,
  onUpdateSite,
  onAddSite,
  onRemoveSite,
  onAddRemote,
  onUpdateRemote,
  onRemoveRemote,
  onToggleRemoteFunction,
}: Props) {
  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardContent className="space-y-10 pt-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Manufacturing Sites *</h3>
          <div className="space-y-6">
            {manufacturingSites.map((site, index) => (
              <div key={index} className="border p-5 rounded-lg space-y-4">
                <Input
                  className="hover:text-black"
                  placeholder={
                    index === 0 ? "Manufacturing Site" : "Extended Manufacturing Site"
                  }
                  value={site.site_name}
                  onChange={(e) => onUpdateSite(index, "site_name", e.target.value)}
                />
                <Textarea
                  placeholder="Address"
                  value={site.address}
                  onChange={(e) => onUpdateSite(index, "address", e.target.value)}
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    className="hover:text-black"
                    placeholder="Employees Mfg"
                    type="number"
                    value={site.employees_mfg}
                    onChange={(e) => onUpdateSite(index, "employees_mfg", e.target.value)}
                  />
                  <Input
                    className="hover:text-black"
                    placeholder="Employees Support"
                    type="number"
                    value={site.employees_support}
                    onChange={(e) => onUpdateSite(index, "employees_support", e.target.value)}
                  />
                  <Input
                    placeholder="Total Employees"
                    value={site.total_employees}
                    disabled
                  />
                </div>

                {/* Remote Locations — first site only */}
                {index === 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Associated Remote Locations</h4>
                    {site.remote_locations.map((remote, rIndex) => (
                      <div
                        key={rIndex}
                        className="border p-4 rounded-lg space-y-3 mb-3"
                      >
                        <Input
                          className="hover:text-black"
                          placeholder="Remote Location Name"
                          value={remote.site_name}
                          onChange={(e) =>
                            onUpdateRemote(index, rIndex, "site_name", e.target.value)
                          }
                        />
                        <Textarea
                          placeholder="Address"
                          value={remote.address}
                          onChange={(e) =>
                            onUpdateRemote(index, rIndex, "address", e.target.value)
                          }
                        />

                        {/* Support Functions multi-select */}
                        <div className="mt-4">
                          <label className="text-sm font-medium mb-2 block">
                            Support Functions
                          </label>
                          <Popover modal={true}>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-between min-h-[44px] px-3 cursor-pointer"
                              >
                                <div className="flex flex-wrap gap-1 max-w-[90%]">
                                  {remote.support_functions?.length > 0 ? (
                                    remote.support_functions.map((func) => (
                                      <Badge
                                        key={func}
                                        variant="secondary"
                                        className="truncate max-w-[180px]"
                                      >
                                        {func}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-muted-foreground text-sm">
                                      Select support functions
                                    </span>
                                  )}
                                </div>
                                <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-[300px] p-0 bg-background bg-white border shadow-lg"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search support functions..."
                                  className="h-8"
                                />
                                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                  No function found
                                </CommandEmpty>
                                <CommandGroup className="max-h-[260px] overflow-auto">
                                  {SUPPORT_FUNCTIONS.map((func) => {
                                    const selected =
                                      remote.support_functions?.includes(func) || false;
                                    return (
                                      <CommandItem
                                        key={func}
                                        value={func}
                                        onSelect={() =>
                                          onToggleRemoteFunction(index, rIndex, func)
                                        }
                                        className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                                      >
                                        <Check
                                          className={cn(
                                            "h-4 w-4",
                                            selected ? "opacity-100" : "opacity-0",
                                          )}
                                        />
                                        <span className="text-sm">{func}</span>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            className="hover:text-black"
                            type="number"
                            placeholder="Employees Support"
                            value={remote.employees_support}
                            onChange={(e) =>
                              onUpdateRemote(index, rIndex, "employees_support", e.target.value)
                            }
                          />
                          <Input disabled value={remote.total_employees} />
                        </div>

                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => onRemoveRemote(index, rIndex)}
                        >
                          Remove Remote Location
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => onAddRemote(index)}
                      className="mt-2"
                    >
                      + Add Remote Location
                    </Button>
                  </div>
                )}

                {manufacturingSites.length > 1 && (
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => onRemoveSite(index)}
                  >
                    Remove Site
                  </Button>
                )}
              </div>
            ))}

            <Button variant="outline" onClick={onAddSite}>
              + Add Extended Manufacturing Site
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
