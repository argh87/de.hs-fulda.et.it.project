package de.hsfulda.et.wbs.http.haljson;

import de.hsfulda.et.wbs.core.HalJsonResource;
import de.hsfulda.et.wbs.core.Link;
import de.hsfulda.et.wbs.core.WbsUser;
import de.hsfulda.et.wbs.core.data.BestandData;
import de.hsfulda.et.wbs.util.UriUtil;

import java.util.List;
import java.util.stream.Collectors;

import static de.hsfulda.et.wbs.Relations.REL_BESTAND_LIST;

public class BestandListHalJson extends HalJsonResource {

    public BestandListHalJson(WbsUser user, List<BestandData> bestaende, Long zielortId) {
        addLink(Link.self(UriUtil.build(REL_BESTAND_LIST, zielortId)));

        List<HalJsonResource> resources = bestaende.stream()
                .map(t -> new BestandHalJson(user, t, false))
                .collect(Collectors.toList());

        addEmbeddedResources("elemente", resources);

    }
}
