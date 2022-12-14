import { FormValues } from "@entities/payment/components/Forms/address-form";
import Input from "@entities/payment/components/Forms/forms/input";
import { usePropRef } from "@shared/lib/usePropRef";
import { $rus } from "@features/choose-dishes/models";
import classNames from "classnames";
import { useStore } from "effector-react";
import { useState, useCallback, useEffect } from "react";
import {
  YMapsApi,
  YMaps,
  Placemark,
  Map,
  ZoomControl,
} from "react-yandex-maps";

const YANDEX_MAP_API_KEY = "9ed3cdf8-1911-49ac-b6d0-70711b8f3edd";

export const MOSCOW_COORDS = [55.761677, 37.632745];
export const KAZAHSTAN_COORDS = [43.256069, 76.945169];

type Keys =
  | "country"
  | "province"
  | "area"
  | "locality"
  | "district"
  | "street"
  | "house"
  | "entrance";

const getAddressString = (form: FormValues) => {
  return (
    [form?.city, form?.district, form?.street, form?.building, form?.part]
      .filter(Boolean)
      .join(" ") + (form?.entrance ? " подъезд " + form?.entrance : "")
  );
};

export const AddressSuggestionsMap = ({
  initialCoords,
  formInitial,
  onChange,
  onError,
  className,
  errors,
  onCoordsChange,
}: {
  initialCoords?: [number | null, number | null];
  formInitial?: FormValues;
  onChange: (data: { [K in Keys]?: string }, coords: (number | null)[]) => void;
  onError?: (e: any) => void;
  className?: string;
  errors?: string[];
  onCoordsChange?: (cords: Array<number | null>) => void;
}) => {
  const isRus = useStore($rus);
  const [ymapsInstance, setYmapsInstance] = useState<YMapsApi | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [coords, setCoords] = useState<Array<number | null>>([null, null]);
  const [viewCoords, setViewCoords] = useState<Array<number | null>>([
    null,
    null,
  ]);
  const [input, setInput] = useState<string>("");

  const decodePosition = useCallback(
    (coords: (number | null)[]) => {
      if (!ymapsInstance) return;
      if (!isReady) return;

      const reverseGeocoder = ymapsInstance.geocode(coords);
      reverseGeocoder.then((data: any) => {
        const components: {
          kind: Keys;
          name: string;
        }[] =
          data.geoObjects.get(0).properties.get("metaDataProperty")
            ?.GeocoderMetaData?.Address?.Components ?? [];

        setInput(data.geoObjects.get(0).properties.get("text"));
        onChange(
          {
            ...components.reduce(
              (obj, { kind, name }) => ({ ...obj, [kind]: name }),
              {}
            ),
          },
          coords
        );
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isReady, ymapsInstance]
  );

  const decodePositionRef = usePropRef(decodePosition);

  const updateInstance = useCallback((instance: any) => {
    if (!instance?.events) return;

    // const onActionHandler = () => {
    //   const coords = instance.getCenter();

    //   setCoords(coords);
    //   onclickhanlderRef.current(coords);
    // };
    // instance.events.add("load", onActionHandler);
    // instance.events.add("actionend", onActionHandler);

    const onclickhanlder = (e: any) => {
      const coords = e.get("coords");

      onCoordsChange?.(coords);
      setCoords(coords);
      decodePositionRef.current(coords);
    };
    instance.events.add("click", onclickhanlder);

    return () => {
      instance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ymapsInstance) return;
    if (!isReady) return;

    if (initialCoords) {
      onCoordsChange?.(initialCoords);
      setCoords(initialCoords);
      decodePositionRef.current(initialCoords);
      setViewCoords(initialCoords);
    }
  }, [isReady, ymapsInstance, initialCoords]);

  const searchCoords = useCallback(
    (address: string) => {
      if (!ymapsInstance) return;
      if (!isReady) return;
      if (!address) return;

      const searchControl = new ymapsInstance.control.SearchControl({
        options: {
          provider: "yandex#map",
        },
      });

      searchControl.search(address).then((data: any) => {
        const cords = data.geoObjects.get(0).geometry.getCoordinates();
        onCoordsChange?.(cords);
        setCoords(cords);
        setViewCoords(cords);
        decodePosition(cords);
      });
    },
    [isReady, ymapsInstance, decodePosition]
  );

  useEffect(() => {
    if (!ymapsInstance) return;
    if (!isReady) return;
    if (!formInitial) return;

    const address = getAddressString(formInitial);

    searchCoords(address);
  }, [ymapsInstance, isReady, formInitial, searchCoords]);

  useEffect(() => {
    if (!ymapsInstance) return;

    ymapsInstance
      .ready()
      .then(() => {
        setIsReady(true);
      })
      .catch(onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ymapsInstance]);

  useEffect(() => {
    if (!ymapsInstance) return;
    if (!isReady) return;

    const suggestView = new ymapsInstance.SuggestView("suggest");

    if (!suggestView?.events) return;

    suggestView.events.add("select", (e: any) => {
      const value = e.get("item").value;

      setInput(value);
      searchCoords(value);
    });
    suggestView.events.add("error", onError);

    return () => {
      suggestView.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, ymapsInstance]);

  const defaultCoords =
    initialCoords || (isRus ? MOSCOW_COORDS : KAZAHSTAN_COORDS);

  const noCoords = viewCoords.some((c) => c === null);
  const _viewCoords = (noCoords ? defaultCoords : viewCoords) as number[];

  return (
    <div className={className}>
      <YMaps
        query={{
          lang: "ru_RU",
          mode: "release",
          apikey: YANDEX_MAP_API_KEY,
        }}
      >
        <div className={classNames("flex flex-col")}>
          <Input
            label="Адрес"
            disabled={!isReady}
            placeholder={!isReady ? "Подождите" : "Введите адрес"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            variant={!isReady ? "solid" : "outline"}
            name="address"
            type="text"
            className={classNames("form-control")}
            id="suggest"
            error=""
          ></Input>

          <div className="w-full pt-5">
            <Map
              width="100%"
              instanceRef={updateInstance as any}
              onLoad={setYmapsInstance}
              onError={onError}
              defaultState={{
                center: _viewCoords,
                zoom: noCoords ? 12 : 18,
              }}
              state={{
                center: _viewCoords,
                zoom: noCoords ? 12 : 18,
              }}
              modules={[
                "SuggestView",
                "control.SearchControl",
                "control.ZoomControl",
                "geocode",
              ]}
            >
              <ZoomControl options={{ float: "right" }} />
              {coords.some((c) => c === null) ? null : (
                <Placemark geometry={coords as number[]} />
              )}
            </Map>
            {errors &&
              errors.map((error) => (
                <p className="my-2 text-xs text-red-500">{error}</p>
              ))}
          </div>
        </div>
      </YMaps>
    </div>
  );
};
